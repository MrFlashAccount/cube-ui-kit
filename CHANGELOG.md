# @cube-dev/ui-kit

## 0.10.13

### Patch Changes

- [#151](https://github.com/cube-js/cube-ui-kit/pull/151) [`e3eaeba`](https://github.com/cube-js/cube-ui-kit/commit/e3eaebac88a3826ad7b1bb542e72e25af563d367) Thanks [@nikolaykost](https://github.com/nikolaykost)! - Adds prop `selectionType` for `Menu` component. That stands for values `checkbox` or `radio`.

  ```jsx
  <Menu selectionType="checkbox" selectionMode="single">
    <Item key="1">Item 1</Item>
    <Item key="2">Item 2</Item>
  </Menu>
  ```

- [#111](https://github.com/cube-js/cube-ui-kit/pull/111) [`f45b927`](https://github.com/cube-js/cube-ui-kit/commit/f45b927bb34dbc9bd0374a5d55c039bd37fa899e) Thanks [@MrFlashAccount](https://github.com/MrFlashAccount)! - [CC-677](https://cubedevinc.atlassian.net/browse/CC-677) significantly improved performance of the `Spin` component in all browsers.

## 0.10.12

### Patch Changes

- [#149](https://github.com/cube-js/cube-ui-kit/pull/149) [`3ea195c`](https://github.com/cube-js/cube-ui-kit/commit/3ea195c713f880e7d4e45e19b72cc6f4a1b4d5b4) Thanks [@tenphi](https://github.com/tenphi)! - fix(Combobox): error on trigger

## 0.10.11

### Patch Changes

- [#133](https://github.com/cube-js/cube-ui-kit/pull/133) [`943dbc6`](https://github.com/cube-js/cube-ui-kit/commit/943dbc69e7225c9f80c85cc887a1928a9b29b09f) Thanks [@tenphi](https://github.com/tenphi)! - fix(FileTabs): styles

- [#146](https://github.com/cube-js/cube-ui-kit/pull/146) [`77a9c29`](https://github.com/cube-js/cube-ui-kit/commit/77a9c29b2fcefe1d49904b170c133dea530f33e7) Thanks [@tenphi](https://github.com/tenphi)! - fix(tasty): style merging while wrapping
  feat(preset.style): add bold-font-weight token

## 0.10.10

### Patch Changes

- [#140](https://github.com/cube-js/cube-ui-kit/pull/140) [`2b12419`](https://github.com/cube-js/cube-ui-kit/commit/2b12419446e001eb69d923ba0ec4523a87999452) Thanks [@tenphi](https://github.com/tenphi)! - fix(Space): items alignment

## 0.10.9

### Patch Changes

- [#138](https://github.com/cube-js/cube-ui-kit/pull/138) [`e7861d3`](https://github.com/cube-js/cube-ui-kit/commit/e7861d33fd480439a9bbbab3a1a0659ec3af8422) Thanks [@tenphi](https://github.com/tenphi)! - Fix extractStyles() logic.
  Fix label position inside a field.

## 0.10.8

### Patch Changes

- [#131](https://github.com/cube-js/cube-ui-kit/pull/131) [`0f4e39a`](https://github.com/cube-js/cube-ui-kit/commit/0f4e39a98e469ee0ed0757d6fc76a2a0eb9591e1) Thanks [@tenphi](https://github.com/tenphi)! - fix(Field): pass labelStyles prop

## 0.10.7

### Patch Changes

- [#129](https://github.com/cube-js/cube-ui-kit/pull/129) [`facd201`](https://github.com/cube-js/cube-ui-kit/commit/facd2013b2130aa44dcdc3e55540742df464c923) Thanks [@tenphi](https://github.com/tenphi)! - fix(Field): pass labelStyles prop

## 0.10.6

### Patch Changes

- [#127](https://github.com/cube-js/cube-ui-kit/pull/127) [`3c875d6`](https://github.com/cube-js/cube-ui-kit/commit/3c875d60e4bc41be17e12926648c9dcfd2ca858c) Thanks [@tenphi](https://github.com/tenphi)! - fix(Field): pass labelPosition prop

## 0.10.5

### Patch Changes

- [#125](https://github.com/cube-js/cube-ui-kit/pull/125) [`7c457f5`](https://github.com/cube-js/cube-ui-kit/commit/7c457f5cb85983f0ed3870d9b2f78b1bdfd81f9f) Thanks [@tenphi](https://github.com/tenphi)! - fix(Card): pass style props

- [#124](https://github.com/cube-js/cube-ui-kit/pull/124) [`f4ed612`](https://github.com/cube-js/cube-ui-kit/commit/f4ed612289bff0526b61696e3d5c054a2cb578fc) Thanks [@tenphi](https://github.com/tenphi)! - fix(Space): condition for the vertical modifier

## 0.10.4

### Patch Changes

- [#119](https://github.com/cube-js/cube-ui-kit/pull/119) [`bdccbf8`](https://github.com/cube-js/cube-ui-kit/commit/bdccbf8d0bd4762659185b9571efbdc1c1e97f09) Thanks [@tenphi](https://github.com/tenphi)! - Allow `tasty` to extend components with required properties.

## 0.10.3

### Patch Changes

- [#120](https://github.com/cube-js/cube-ui-kit/pull/120) [`6aa6e26`](https://github.com/cube-js/cube-ui-kit/commit/6aa6e2645fc92bd8d7d6ed86f4e2ddff5fc7df62) Thanks [@tenphi](https://github.com/tenphi)! - Fix the display style default value in gap style generator.

## 0.10.2

### Patch Changes

- [#116](https://github.com/cube-js/cube-ui-kit/pull/116) [`3967bd0`](https://github.com/cube-js/cube-ui-kit/commit/3967bd05c7a810ab4d83b71236b33f9382f00329) Thanks [@tenphi](https://github.com/tenphi)! - Pass `styles` prop to Field component.
  Add stories for Field component.
  Export `CubeRadioGroupProps` type.

## 0.10.1

### Patch Changes

- [#113](https://github.com/cube-js/cube-ui-kit/pull/113) [`d6e2f46`](https://github.com/cube-js/cube-ui-kit/commit/d6e2f46c15aad30a102e070412e570fbc39ac725) Thanks [@MrFlashAccount](https://github.com/MrFlashAccount)! - Fixed transparent background of `<Select />` component

- [#112](https://github.com/cube-js/cube-ui-kit/pull/112) [`7432820`](https://github.com/cube-js/cube-ui-kit/commit/743282055b923d841d9caab34361a4f4df2e987f) Thanks [@tenphi](https://github.com/tenphi)! - Stabilize Form behavior.
  Fix Switch component styles.

## 0.10.0

### Minor Changes

- [#84](https://github.com/cube-js/cube-ui-kit/pull/84) [`9af598c`](https://github.com/cube-js/cube-ui-kit/commit/9af598c08a0f1e2ea2a5e4a00118367428262e27) Thanks [@tenphi](https://github.com/tenphi)! - [CUK-72](https://cubedevinc.atlassian.net/jira/software/projects/CUK/boards/3?selectedIssue=CUK-72) Move all style engine logic into a single folder `tasty` and export new `tasty()` helper as `styled` replacement but with simplified and optimized API.

- [#99](https://github.com/cube-js/cube-ui-kit/pull/99) [`8be45cd`](https://github.com/cube-js/cube-ui-kit/commit/8be45cddb565cc093b4d3b421de6984d5646a91b) Thanks [@MrFlashAccount](https://github.com/MrFlashAccount)! - [CC-484](https://cubedevinc.atlassian.net/browse/CC-484) This PR removes several organisms from ui-kit: TopBar, StatsCard, SearchResults, DirectoryTree.

### Patch Changes

- [#110](https://github.com/cube-js/cube-ui-kit/pull/110) [`52fbee3`](https://github.com/cube-js/cube-ui-kit/commit/52fbee3bef49c96182ca735770db5dca1e7338f4) Thanks [@tenphi](https://github.com/tenphi)! - Update `Select` & `Combobox` selected option styles.

- [#105](https://github.com/cube-js/cube-ui-kit/pull/105) [`8ce1f2d`](https://github.com/cube-js/cube-ui-kit/commit/8ce1f2dd84a0f4f1e11b7e0e65212ac73bdf3cd0) Thanks [@MrFlashAccount](https://github.com/MrFlashAccount)! - [CUK-33](https://cubedevinc.atlassian.net/browse/CUK-33) Now you can use the `<DialogForm />` component together with `<DialogTrigger />` 🎉

  ```tsx
  <DialogTrigger>
    <Button>Open dialog</Button>
    <DialogForm>...</DialogForm>
  </DialogTrigger>
  ```

- [#105](https://github.com/cube-js/cube-ui-kit/pull/105) [`8ce1f2d`](https://github.com/cube-js/cube-ui-kit/commit/8ce1f2dd84a0f4f1e11b7e0e65212ac73bdf3cd0) Thanks [@MrFlashAccount](https://github.com/MrFlashAccount)! - [CUK-33](https://cubedevinc.atlassian.net/browse/CUK-33) Removed unused `type` property in the `<DialogForm />`component

- [#104](https://github.com/cube-js/cube-ui-kit/pull/104) [`cead470`](https://github.com/cube-js/cube-ui-kit/commit/cead4704c8fb03bfba70c8652fde7cd8c814bf9a) Thanks [@tenphi](https://github.com/tenphi)! - Deprecation of StyleProvider

- [#104](https://github.com/cube-js/cube-ui-kit/pull/104) [`cead470`](https://github.com/cube-js/cube-ui-kit/commit/cead4704c8fb03bfba70c8652fde7cd8c814bf9a) Thanks [@tenphi](https://github.com/tenphi)! - Fix paddings and `size` prop typings in Dialog Component.

- [#105](https://github.com/cube-js/cube-ui-kit/pull/105) [`8ce1f2d`](https://github.com/cube-js/cube-ui-kit/commit/8ce1f2dd84a0f4f1e11b7e0e65212ac73bdf3cd0) Thanks [@MrFlashAccount](https://github.com/MrFlashAccount)! - [CUK-33](https://cubedevinc.atlassian.net/browse/CUK-33) Added documentation for the `<DialogForm />` component

- [#104](https://github.com/cube-js/cube-ui-kit/pull/104) [`cead470`](https://github.com/cube-js/cube-ui-kit/commit/cead4704c8fb03bfba70c8652fde7cd8c814bf9a) Thanks [@tenphi](https://github.com/tenphi)! - Fix neutral pressed fill style for Button component

- [#109](https://github.com/cube-js/cube-ui-kit/pull/109) [`57a4cd3`](https://github.com/cube-js/cube-ui-kit/commit/57a4cd319eb8f7a9259772c289c218fce8a6e649) Thanks [@nikolaykost](https://github.com/nikolaykost)! - Rework design of `Menu` component with _sections_.
  Now _sections_ more readable and has convenient design.

- [#104](https://github.com/cube-js/cube-ui-kit/pull/104) [`cead470`](https://github.com/cube-js/cube-ui-kit/commit/cead4704c8fb03bfba70c8652fde7cd8c814bf9a) Thanks [@tenphi](https://github.com/tenphi)! - Support for `element` prop in `tasty` helper.

- [#104](https://github.com/cube-js/cube-ui-kit/pull/104) [`cead470`](https://github.com/cube-js/cube-ui-kit/commit/cead4704c8fb03bfba70c8652fde7cd8c814bf9a) Thanks [@tenphi](https://github.com/tenphi)! - Fix Legacy Modal component to correctly pass theme prop

## 0.9.12

### Patch Changes

- [#90](https://github.com/cube-js/cube-ui-kit/pull/90) [`ed07084`](https://github.com/cube-js/cube-ui-kit/commit/ed070842d46e5b448d1f88a9eeaee01b27d46467) Thanks [@MrFlashAccount](https://github.com/MrFlashAccount)! - this is a test release. will be removed

## 0.9.11

### Patch Changes

- [#89](https://github.com/cube-js/cube-ui-kit/pull/89) [`da511c5`](https://github.com/cube-js/cube-ui-kit/commit/da511c5749c6cb85272852fc323caf02a9177eba) Thanks [@MrFlashAccount](https://github.com/MrFlashAccount)! - this is a test release
