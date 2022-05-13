import { getByTestId, render } from '@testing-library/react';
import { tasty } from './tasty';
import { Button } from '../components/actions';
import { Block } from '../components/Block';

describe('tasty() API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should provide defaults and give ability to override', () => {
    const SButton = tasty(Button, { type: 'primary' });

    const { getByTestId, rerender } = render(
      <SButton qa="button" label="Button" />,
    );
    expect(getByTestId('button').dataset.type).toBe('primary');

    rerender(<SButton type="secondary" qa="button" label="Button" />);
    expect(getByTestId('button').dataset.type).toBe('secondary');
  });

  it('should pass styles from tasty', () => {
    const StyledBlock = tasty(Block, { styles: { color: '#clear.1' } });
    const { container } = render(<StyledBlock />);

    expect(container).toMatchSnapshot();
  });

  it('should be able to override styles', () => {
    const StyledBlock = tasty(Block, { styles: { color: '#clear.1' } });
    const { container } = render(
      <StyledBlock styles={{ color: '#black.1' }} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should pass qa prop', () => {
    const StyledBlock = tasty({ qa: 'Field' });
    const { container } = render(<StyledBlock />);

    expect(getByTestId(container, 'Field', {})).toBeDefined();
  });

  it('should create responsive styles', () => {
    const StyledBlock = tasty(Block, { styles: { display: ['grid', 'flex'] } });
    const { container } = render(<StyledBlock />);

    expect(container).toMatchSnapshot();
  });
});
