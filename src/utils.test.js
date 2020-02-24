import { move } from './utils'

test("element should be move from 2 to 4", () => {
  expect(move([1,2,3,4,5], 2, 4)).toEqual([1,2,4,5,3]);
});