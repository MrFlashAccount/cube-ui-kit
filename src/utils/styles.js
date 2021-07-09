/**
 * @typedef {Array<NuComputeModel|string|number>} NuComputeModel
 */

/**
 * @typedef {Array<string,string|Array>} NuCSSMap
 */

/**
 * @typedef {function} NuStyleHandler
 * @property {Array<String>} __styleLookup
 */

/**
 * @typedef NuStyleStateData
 * @property {NuComputeModel} model
 * @property {Array<string>} [tokens]
 * @property {NuStyleValue} value
 * @property {string[]} mods
 */

/**
 * @typedef {NuStyleStateData[]} NuStyleStateDataList
 */

/**
 * @typedef {Object<string,NuStyleStateDataList>} NuStyleStateDataListMap
 */

/**
 * An object that describes a relation between specific modifiers and style value.
 * @typedef NuStyleState
 * @property {string[]} mods
 * @property {string[]} [notMods]
 * @property {NuStyleValue} value
 */

/**
 * @typedef {Array<NuComputeUnit>|Number} NuComputeUnit
 */

/**
 * @typedef {NuStyleState[]} NuStyleStateList
 */

/**
 * @typedef {string|boolean|null|undefined} NuStyleValue
 */

/**
 * @typedef {Object<string,NuStyleValue>} NuStyleMap
 */

/**
 * @typedef {Object<string,NuStyleState>} NuStyleStateMap
 */

/**
 * @typedef {NuStyleStateMap[]} NuStyleStateMapList
 */

/**
 * @typedef {Object<string,NuStyleStateList>} NuStyleStateListMap
 */

import { getCombinations } from './index.js';

export const NO_VALUES = [false, 'n', 'no', 'false'];
export const YES_VALUES = [true, 'y', 'yes', 'true'];
const devMode = process.env.NODE_ENV !== 'production';
export const CUSTOM_UNITS = {
  r: 'var(--radius)',
  bw: 'var(--border-width)',
  ow: 'var(--outline-width)',
  x: 'var(--gap)',
  fs: 'var(--font-size)',
  lh: 'var(--line-height)',
  rp: 'var(--rem-pixel)',
  gp: 'var(--column-gap)',
  // global setting
  wh: 'var(--window-height)',
};
export const DIRECTIONS = ['top', 'right', 'bottom', 'left'];
const COLOR_FUNCS = ['rgb', 'rgba'];
const IGNORE_MODS = [
  'auto',
  'max-content',
  'min-content',
  'none',
  'subgrid',
  'initial',
];
const ATTR_REGEXP =
  /("[^"]*")|('[^']*')|([a-z]+\()|(#[a-z0-9.-]{2,}(?![a-f0-9[-]))|(--[a-z0-9-]+|@[a-z0-9-]+)|([a-z][a-z0-9-]*)|(([0-9]+(?![0-9.])|[0-9-.]{2,}|[0-9-]{2,}|[0-9.-]{3,})([a-z%]{0,3}))|([*\/+-])|([()])|(,)/gi;
const ATTR_CACHE = new Map();
const ATTR_CACHE_AUTOCALC = new Map();
const ATTR_CACHE_IGNORE_COLOR = new Map();
const MAX_CACHE = 10000;
const ATTR_CACHE_MODE_MAP = [
  ATTR_CACHE_AUTOCALC,
  ATTR_CACHE,
  ATTR_CACHE_IGNORE_COLOR,
];
const PREPARE_REGEXP = /calc\((\d*)\)/gi;

export function createRule(prop, value, selector) {
  if (value == null) return '';

  if (selector) {
    return `${selector} { ${prop}: ${value}; }\n`;
  }

  return `${prop}: ${value};\n`;
}

function getModSelector(modName) {
  return modName.match(/^[a-z]/) ? `[data-is-${modName}]` : modName;
}

/**
 *
 * @param {String} value
 * @param {Number} mode
 * @returns {Object<String,String|Array>}
 */
export function parseStyle(value, mode = 0) {
  if (typeof value === 'number') {
    value = String(value);
  }

  if (typeof value !== 'string') {
    return {
      values: [],
      mods: [],
      all: [],
      value: '',
    };
  }

  const CACHE = ATTR_CACHE_MODE_MAP[mode];

  if (!CACHE.has(value)) {
    if (CACHE.size > MAX_CACHE) {
      CACHE.clear();
    }

    const mods = [];
    const all = [];
    const values = [];
    const autoCalc = mode !== 1;

    let currentValue = '';
    let calc = -1;
    let counter = 0;
    let parsedValue = '';
    let color = '';
    let currentFunc = '';
    let usedFunc = '';
    let token;

    ATTR_REGEXP.lastIndex = 0;

    value = value.replace(/@\(/g, 'var(--');

    while ((token = ATTR_REGEXP.exec(value))) {
      let [
        /* eslint-disable-next-line */
        s,
        quotedDouble,
        quotedSingle,
        func,
        hashColor,
        prop,
        mod,
        unit,
        unitVal,
        unitMetric,
        operator,
        bracket,
        comma,
      ] = token;

      if (quotedSingle || quotedDouble) {
        currentValue += `${quotedSingle || quotedDouble} `;
      } else if (func) {
        currentFunc = func.slice(0, -1);
        currentValue += func;
        counter++;
      } else if (hashColor) {
        // currentValue += `${hashColor} `;
        if (mode === 2) {
          color = hashColor;
        } else {
          color = parseColor(hashColor, false).color;
        }
      } else if (mod) {
        // ignore mods inside brackets
        if (counter || IGNORE_MODS.includes(mod)) {
          currentValue += `${mod} `;
        } else {
          mods.push(mod);
          all.push(mod);
          parsedValue += `${mod} `;
        }
      } else if (bracket) {
        if (bracket === '(') {
          if (!~calc) {
            calc = counter;
            currentValue += 'calc';
          }

          counter++;
        }

        if (bracket === ')' && counter) {
          currentValue = currentValue.trim();

          if (counter > 0) {
            counter--;
          }

          if (counter === calc) {
            calc = -1;
          }
        }

        if (bracket === ')' && !counter) {
          usedFunc = currentFunc;
          currentFunc = '';
        }

        currentValue += `${bracket}${bracket === ')' ? ' ' : ''}`;
      } else if (operator) {
        if (!~calc && autoCalc) {
          if (currentValue) {
            if (currentValue.includes('(')) {
              const index = currentValue.lastIndexOf('(');

              currentValue = `${currentValue.slice(
                0,
                index,
              )}(calc(${currentValue.slice(index + 1)}`;

              calc = counter;
              counter++;
            }
          } else if (values.length) {
            parsedValue = parsedValue.slice(
              0,
              parsedValue.length - values[values.length - 1].length - 1,
            );

            let tmp = values.splice(values.length - 1, 1)[0];

            all.splice(values.length - 1, 1);

            if (tmp) {
              if (tmp.startsWith('calc(')) {
                tmp = tmp.slice(4);
              }

              calc = counter;
              counter++;
              currentValue = `calc((${tmp}) `;
            }
          }
        }

        currentValue += `${operator} `;
      } else if (unit) {
        if (unitMetric && CUSTOM_UNITS[unitMetric]) {
          let add = customUnit(unitVal, unitMetric);

          if (!~calc && add.startsWith('(')) {
            currentValue += 'calc';
          }

          currentValue += `${add} `;
        } else {
          currentValue += `${unit} `;
        }
      } else if (prop) {
        prop = prop.replace('@', '--');
        if (currentFunc !== 'var') {
          currentValue += `var(${prop}) `;
        } else {
          currentValue += `${prop} `;
        }
      } else if (comma) {
        if (~calc) {
          calc = -1;
          counter--;
          currentValue = `${currentValue.trim()}), `;
        } else {
          currentValue = `${currentValue.trim()}, `;
        }
      }

      if (currentValue && !counter) {
        let prepared = prepareParsedValue(currentValue);

        if (COLOR_FUNCS.includes(usedFunc)) {
          color = prepared;
        } else if (prepared.startsWith('color(')) {
          prepared = prepared.slice(6, -1);

          color = parseColor(prepared).color;
        } else {
          if (prepared !== ',') {
            values.push(prepared);
            all.push(prepared);
          }

          parsedValue += `${prepared} `;
        }

        currentValue = '';
      }
    }

    if (counter) {
      let prepared = prepareParsedValue(
        `${currentValue.trim()}${')'.repeat(counter)}`,
      );

      if (prepared.startsWith('color(')) {
        prepared = prepared.slice(6, -1);

        color = parseColor(prepared).color;
      } else {
        if (prepared !== ',') {
          values.push(prepared);
          all.push(prepared);
        }

        parsedValue += prepared;
      }
    }

    CACHE.set(value, {
      values,
      mods,
      all,
      value: `${parsedValue} ${color}`.trim(),
      color,
    });
  }

  return CACHE.get(value);
}

/**
 *
 * @param {String} val
 * @param {Boolean} ignoreError
 * @return {{color}|{color: string, name: *, opacity: *}|{}|{color: string, name: string, opacity: (number|number)}|{color: string, name: *}}
 */
export function parseColor(val, ignoreError = false) {
  val = val.trim();

  if (!val) return {};

  if (val.startsWith('#')) {
    val = val.slice(1);

    const tmp = val.split('.');

    let opacity = 100;

    if (tmp.length > 1) {
      if (tmp[1].length === 1) {
        opacity = Number(tmp[1]) * 10;
      } else {
        opacity = Number(tmp[1]);
      }

      if (Number.isNaN(opacity)) {
        opacity = 100;
      }
    }

    const name = tmp[0];

    let color;

    if (name === 'current') {
      color = 'currentColor';
    } else {
      if (opacity > 100) {
        opacity = 100;
      } else if (opacity < 0) {
        opacity = 0;
      }
    }

    color =
      opacity !== 100
        ? rgbColorProp(name, Math.round(opacity) / 100)
        : colorProp(name, null, strToRgb(`#${name}`));

    return {
      color,
      name,
      opacity: opacity != null ? opacity : 100,
    };
  }

  let { values, mods, color } = parseStyle(val);

  let name, opacity;

  if (color) {
    return {
      color: (!color.startsWith('var(') ? strToRgb(color) : color) || color,
    };
  }

  values.forEach((token) => {
    if (token.match(/^((var|rgb|rgba|hsl|hsla)\(|#[0-9a-f]{3,6})/)) {
      color = !token.startsWith('var') ? strToRgb(token) : token;
    } else if (token.endsWith('%')) {
      opacity = parseInt(token);
    }
  });

  if (color) {
    return { color };
  }

  name = name || mods[0];

  if (!name) {
    if (!ignoreError && devMode) {
      console.warn('incorrect color value:', val);
    }

    return {};
  }

  if (!opacity) {
    let color;

    if (name === 'current') {
      color = 'currentColor';
    } else if (name === 'inherit') {
      color = 'inherit';
    } else {
      color = `var(--${name}-color)`;
    }

    return {
      name,
      color,
    };
  }

  return {
    color: rgbColorProp(name, Math.round(opacity) / 100),
    name,
    opacity,
  };
}

export function rgbColorProp(
  colorName,
  opacity,
  fallbackColorName,
  fallbackValue,
) {
  const fallbackValuePart = fallbackValue ? `, ${fallbackValue}` : '';

  return `rgba(var(--${colorName}-color-rgb${
    fallbackColorName
      ? `, var(--${fallbackColorName}-color-rgb, ${fallbackValuePart})`
      : fallbackValuePart
  }), ${opacity})`;
}

export function colorProp(colorName, fallbackColorName, fallbackValue) {
  const fallbackValuePart = fallbackValue ? `, ${fallbackValue}` : '';

  return `var(--${colorName}-color${
    fallbackColorName
      ? `, var(--${fallbackColorName}${fallbackValuePart})`
      : fallbackValuePart
  })`;
}

export function strToRgb(color, ignoreAlpha = false) {
  if (!color) return undefined;

  if (color.startsWith('rgb')) return color;

  if (color.startsWith('#')) return hexToRgb(color);

  return null;
}

export function getRgbValuesFromRgbaString(str) {
  return str.match(/\d+/g).map(s => parseInt(s)).slice(0, 3);
}

export function hexToRgb(hex) {
  const rgba = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map((x, i) => parseInt(x, 16) * (i === 3 ? 1 / 255 : 1));

  if (rgba.length === 3) {
    return `rgb(${rgba.join(', ')})`;
  } else if (rgba.length === 4) {
    return `rgba(${rgba.join(', ')})`;
  }

  return null;
}

export function transferMods(mods, from, to) {
  mods.forEach((mod) => {
    if (from.includes(mod)) {
      to.push(mod);
      from.splice(from.indexOf(mod), 1);
    }
  });
}

function prepareParsedValue(val) {
  return val.trim().replace(PREPARE_REGEXP, (s, inner) => inner);
}

export function filterMods(mods, allowedMods) {
  return mods.filter((mod) => allowedMods.includes(mod));
}

export function customUnit(value, unit) {
  const converter = CUSTOM_UNITS[unit];

  if (typeof converter === 'function') {
    return converter(value);
  }

  if (value === '1' || value === 1) {
    return converter;
  }

  return `(${value} * ${converter})`;
}

/**
 * Check for "no" value.
 * @param {string} value - original attribute value.
 * @return {boolean}
 */
export function isNoValue(value) {
  return !value && value !== 0;
}

/**
 * Check for "yes" value.
 * @param {string} value - original attribute value.
 * @return {boolean}
 */
export function isYesValue(value) {
  return YES_VALUES && YES_VALUES.includes(value);
}

export function extendStyles(defaultStyles, newStyles) {
  let styles = {};

  if (!defaultStyles) {
    if (!newStyles) {
      return styles;
    }
  } else {
    styles = Object.assign({}, defaultStyles);
  }

  if (newStyles) {
    Object.keys(newStyles).forEach((key) => {
      if (newStyles[key] != null) {
        styles[key] = newStyles[key];
      }
    });
  }

  return styles;
}

/**
 * Split properties into style and non-style properties.
 * @param {Object} props - Component prop map.
 * @param {String[]} styleList - List of all style properties.
 * @param {Object} [defaultStyles] - Default style map of the component.
 * @param {Object} [propMap] - Props to style alias map.
 * @param {String[]} [ignoreList] - A list of properties to ignore.
 * @return {{}}
 */
export function extractStyles(
  props,
  styleList,
  defaultStyles,
  propMap,
  ignoreList = [],
) {
  const styles = {
    ...defaultStyles,
    ...props.styles,
  };

  Object.keys(props).forEach((prop) => {
    const propName = propMap ? propMap[prop] || prop : prop;
    const value = props[prop];

    if (ignoreList && ignoreList.includes(prop)) {
      // do nothing
    } else if (styleList.includes(propName)) {
      if (value != null && (value !== false || propName in styles)) {
        styles[propName] = value;
      }
    }
  }, {});

  return styles;
}

/**
 * Render NuCSSMap to Styled Components CSS
 * @param {Object|Array|null|undefined} styles
 * @param {string} [selector]
 * @return {string}
 */
export function renderStylesToSC(styles, selector) {
  if (!styles) return '';

  if (Array.isArray(styles)) {
    return styles.reduce((css, stls) => {
      return css + renderStylesToSC(stls);
    }, '');
  }

  const { $, css, ...styleProps } = styles;
  let renderedStyles = Object.keys(styleProps).reduce(
    (styleList, styleName) => {
      const value = styleProps[styleName];

      if (Array.isArray(value)) {
        return (
          styleList +
          value.reduce((css, val) => {
            if (val) {
              return css + `${styleName}:${val};\n`;
            }

            return css;
          }, '')
        );
      }

      if (value) {
        return `${styleList}${styleName}:${value};\n`;
      }

      return styleList;
    },
    '',
  );

  if (css) {
    renderedStyles = css + '\n' + renderedStyles;
  }

  if (!renderedStyles) {
    return '';
  }

  if (Array.isArray($)) {
    return `${selector ? `${selector}{\n` : ''}${$.reduce((rend, suffix) => {
      return (
        rend +
        `${suffix ? `&${suffix}{\n` : ''}${renderedStyles}${
          suffix ? '}\n' : ''
        }`
      );
    }, '')}${selector ? '}\n' : ''}`;
  }

  return `${selector ? `${selector}{\n` : ''}${
    $ ? `&${$}{\n` : ''
  }${renderedStyles}${$ ? '}\n' : ''}${selector ? '}\n' : ''}`;
}

/**
 * Compile states to finite CSS with selectors.
 * State values should contain a string value with CSS style list.
 * @param {string} selector
 * @param {NuStyleStateList|NuStyleStateMapList} states
 */
export function applyStates(selector, states) {
  return states.reduce((css, state) => {
    if (!state.value) return '';

    const modifiers = `${(state.mods || []).map(getModSelector).join('')}${(
      state.notMods || []
    )
      .map((mod) => `:not(${getModSelector(mod)})`)
      .join('')}`;

    return `${css}${selector}${modifiers}{\n${state.value}}\n`;
  }, '');
}

export function styleHandlerCacheWrapper(styleHandler, limit = 1000) {
  const wrappedStyleHandler = cacheWrapper((styleMap) => {
    return renderStylesToSC(styleHandler(styleMap));
  }, limit);

  const wrappedMapHandler = cacheWrapper((styleMap) => {
    if (styleMap == null || styleMap === false) return null;

    const stateMapList = styleMapToStyleMapStateList(styleMap);

    replaceStateValues(stateMapList, wrappedStyleHandler);

    return applyStates('&&', stateMapList);
  }, limit);

  wrappedMapHandler.__lookupStyles = styleHandler.__lookupStyles;

  return wrappedMapHandler;
}

/**
 * Fill all unspecified states and cover all possible combinations of presented modifiers.
 * @param {NuStyleStateList} stateList
 * @param {string[]} [allModes]
 * @return {NuStyleStateList}
 */
export function normalizeStates(stateList, allModes) {
  let baseState;

  stateList.forEach((state) => {
    if (!state.mods.length) {
      baseState = state;
    }

    state.mods.sort();
  });

  if (!baseState) {
    baseState = {
      mods: [],
      value: '',
    };

    stateList.unshift(baseState);
  }

  if (!allModes) {
    const allModesSet = new Set();

    stateList.forEach((state) =>
      state.mods.forEach((mod) => allModesSet.add(mod)),
    );

    allModes = Array.from(allModesSet);
  }

  const allCombinations = getCombinations(allModes).concat([]);

  allCombinations.forEach((comb) => {
    comb.sort();

    const existState = stateList.find(
      (state) => state.mods.join() === comb.join(),
    );

    if (existState) return;

    stateList.push({
      mods: comb,
      notMods: [],
      value: baseState.value,
    });
  });

  stateList.forEach((state) => {
    state.notMods = allModes.filter((mod) => !state.mods.includes(mod));
  });

  return stateList;
}

/**
 * Replace state values with new ones.
 * For example, if you want to replace initial values with finite CSS code.
 * @param {NuStyleStateList|NuStyleStateMapList} states
 * @param {Function} replaceFn
 */
export function replaceStateValues(states, replaceFn) {
  const cache = new Map();

  states.forEach((state) => {
    if (!cache.get(state.value)) {
      cache.set(state.value, replaceFn(state.value));
    }

    state.value = cache.get(state.value);
  });

  return states;
}

/**
 * Get all presented modes from style state list.
 * @param {NuStyleStateList} stateList
 */
export function getModesFromStyleStateList(stateList) {
  return stateList.reduce((list, state) => {
    state.mods.forEach((mod) => {
      if (!list.includes(mod)) {
        list.push(mod);
      }
    });

    return list;
  }, []);
}

/**
 * Get all presented modes from style state list map.
 * @param {NuStyleStateMapList} stateListMap
 * @return {string[]}
 */
export function getModesFromStyleStateListMap(stateListMap) {
  return Object.keys(stateListMap).reduce((list, style) => {
    const stateList = stateListMap[style];

    getModesFromStyleStateList(stateList).forEach((mod) => {
      if (!list.includes(mod)) {
        list.push(mod);
      }
    });

    return list;
  }, []);
}

/**
 * Convert style map to the normalized style map state list.
 * @param {NuStyleMap} styleMap
 * @param {string[]} [keys]
 * @return {NuStyleStateMapList}
 */
export function styleMapToStyleMapStateList(styleMap, keys) {
  keys = keys || Object.keys(styleMap);

  if (!keys.length) return [];

  /**
   * //@type {NuStyleStateListMap}
   */
  const stateDataListMap = {};

  let allMods = new Set();

  keys.forEach((style) => {
    stateDataListMap[style] = styleStateMapToStyleStateDataList(
      styleMap[style],
    );
    stateDataListMap[style].mods.forEach(allMods.add, allMods);
  });

  allMods = Array.from(allMods);

  const styleStateMapList = [];

  getCombinations(allMods, true).forEach((combination) => {
    styleStateMapList.push({
      mods: combination,
      notMods: allMods.filter((mod) => !combination.includes(mod)),
      value: keys.reduce((map, key) => {
        map[key] = stateDataListMap[key].states.find((state) => {
          return computeState(state.model, (mod) => combination.includes(mod));
        }).value;

        return map;
      }, {}),
    });
  });

  return styleStateMapList;
}

const STATES_REGEXP =
  /([&|!^])|([()])|([a-z0-6-]+)|(:[a-z0-6-]+)|(\.[a-z0-6-]+)|(\[[^\]]+])/gi;
export const STATE_OPERATORS = {
  NOT: '!',
  AND: '&',
  OR: '|',
  XOR: '^',
};

export const STATE_OPERATOR_LIST = ['!', '&', '|', '^'];

/**
 *
 * @param {string[]} tokens
 * @return {NuComputeModel}
 */
function convertTokensToComputeUnits(tokens) {
  if (tokens.length === 1) {
    return tokens[0];
  }

  STATE_OPERATOR_LIST.forEach((operator) => {
    let i;

    while ((i = tokens.indexOf(operator)) !== -1) {
      const token = tokens[i];

      if (token === '!') {
        if (tokens[i + 1] && tokens[i + 1] !== 1) {
          tokens.splice(i, 2, ['!', tokens[i + 1]]);
        } else {
          tokens.splice(i, 1);
        }
      } else {
        if (
          tokens[i - 1] &&
          tokens[i + 1] &&
          tokens[i - 1].length !== 1 &&
          tokens[i + 1].length !== 1
        ) {
          tokens.splice(i - 1, 3, [token, tokens[i - 1], tokens[i + 1]]);
        } else {
          tokens.splice(i, 1);
        }
      }
    }
  });

  return tokens.length === 1 ? tokens[0] : tokens;
}

/**
 * Parse state notation and return tokens, modifiers and compute model.
 * @param {string} notation
 * @param {any} [value]
 * @return {Array<string>}
 */
function parseStateNotationInner(notation, value) {
  const tokens = notation.replace(/,/g, '|').match(STATES_REGEXP);

  if (!tokens || !tokens.length) {
    return {
      model: null,
      mods: [],
      tokens,
      value,
    };
  } else if (tokens.length === 1) {
    return {
      model: tokens[0],
      mods: tokens.slice(0),
      tokens,
      value,
    };
  }

  const mods = [];

  let operations = [[]];
  let list = operations[0];
  let position = 0;

  tokens.forEach((token) => {
    switch (token) {
      case '(':
        const operation = [];
        position++;
        list = operations[position] = operation;
        break;
      case ')':
        position--;
        operations[position].push(convertTokensToComputeUnits(list));
        list = operations[position];
        break;
      default:
        if (token.length > 1) {
          if (!mods.includes(token)) {
            mods.push(token);
          }
        }
        list.push(token);
    }
  });

  while (position) {
    position--;
    operations[position].push(convertTokensToComputeUnits(list));
    list = operations[position];
  }

  return {
    tokens,
    mods,
    model: convertTokensToComputeUnits(operations[0]),
    value,
  };
}

export const parseStateNotation = cacheWrapper(parseStateNotationInner);

/**
 *
 * @param {NuStyleStateMap|string|number|boolean|null|undefined} styleStateMap
 * @return {{ states: NuStyleStateDataList, mods: string[] }}
 */
export function styleStateMapToStyleStateDataList(styleStateMap) {
  if (typeof styleStateMap !== 'object' || !styleStateMap) {
    return {
      states: [
        {
          model: null,
          mods: [],
          value: styleStateMap,
        },
      ],
      mods: [],
    };
  }

  const stateDataList = [];

  Object.keys(styleStateMap).forEach((stateNotation) => {
    const state = parseStateNotation(stateNotation);

    state.value = styleStateMap[stateNotation];

    stateDataList.push(state);
  });

  stateDataList.reverse();

  let initialState;

  const allMods = stateDataList.reduce((all, state) => {
    if (!state.mods.length) {
      initialState = state;
    } else {
      state.mods.forEach((mod) => {
        if (!all.includes(mod)) {
          all.push(mod);
        }
      });
    }

    return all;
  }, []);

  if (!initialState) {
    stateDataList.push({
      model: null,
      mods: [],
      notMods: allMods,
      value: true,
    });
  }

  return { states: stateDataList, mods: allMods };
}

export const COMPUTE_FUNC_MAP = {
  '!': (a) => !a,
  '^': (a, b) => a ^ b,
  '|': (a, b) => a | b,
  '&': (a, b) => a & b,
};

/**
 * Compute a result based on model and incoming map.
 * @param {NuComputeModel} computeModel
 * @param {Array<boolean|number>|Object<string,boolean>|Function} valueMap
 * @return {boolean}
 */
export function computeState(computeModel, valueMap) {
  if (!computeModel) return true;

  if (!Array.isArray(computeModel)) {
    if (typeof valueMap === 'function') {
      return !!valueMap(computeModel);
    } else {
      return !!valueMap[computeModel];
    }
  }

  const func = COMPUTE_FUNC_MAP[computeModel[0]];

  if (!func) {
    console.warn('nusc: unexpected compute method in the model', computeModel);
    // return false;
  }

  let a = computeModel[1];

  if (typeof a === 'object') {
    a = !!computeState(a, valueMap);
  } else if (typeof valueMap === 'function') {
    a = !!valueMap(a);
  } else {
    a = !!valueMap[a];
  }

  if (computeModel.length === 2) {
    return func(a);
  }

  let b = computeModel[2];

  if (typeof b === 'object') {
    b = !!computeState(b, valueMap);
  } else if (typeof valueMap === 'function') {
    b = !!valueMap(b);
  } else {
    b = !!valueMap[b];
  }

  return !!func(a, b);
}

export function cacheWrapper(handler, limit) {
  let cache = {};
  let count = 0;

  return (arg) => {
    const key = typeof arg === 'string' ? arg : JSON.stringify(arg);

    if (!cache[key]) {
      if (count > limit) {
        cache = {};
        count = 0;
      }

      count++;

      cache[key] = handler(arg);
    }

    return cache[key];
  };
}

/**
 * Check for "no" value in modifiers.
 * @param mods {Array<String>} - original attribute value.
 * @return {boolean}
 */
export function hasNegativeMod(mods) {
  return mods != null && !!NO_VALUES.find((val) => mods.includes(val));
}
