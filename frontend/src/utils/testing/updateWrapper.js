import { act } from 'react-dom/test-utils';

export function wait(amount = 0) {
  return new Promise(resolve => setTimeout(resolve, amount));
}

export default async (wrapper, amount = 0) => {
  // eslint-disable-next-line no-underscore-dangle
  const fakeTimers = setTimeout._isMockFunction;
  await act(async () => {
    if (fakeTimers) jest.useRealTimers();
    await wait(amount);
    if (fakeTimers) jest.useFakeTimers();
    wrapper.update();
  });
};
