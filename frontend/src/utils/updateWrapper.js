import { act } from 'react-dom/test-utils';

export function wait(amount = 0) {
  return new Promise(resolve => setTimeout(resolve, amount));
}

export default async (wrapper, amount = 0) => {
  await act(async () => {
    jest.useRealTimers();
    await wait(amount);
    jest.useFakeTimers();
    wrapper.update();
  });
};
