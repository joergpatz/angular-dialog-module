import { mergeDeep, isObject } from './merge-deep.utils';

describe('MergeDeepUtils', () => {
  const A = {name: "A"};
  const B = {name: "B"};
  const blueprint = {
    component: A,
    inputs: {
      title: "default title",
      labels: {
        button: "continue"
      }
    }
  };
  const blueprintClone = {
    component: A,
    inputs: {
      title: "default title",
      labels: {
        button: "continue"
      }
    }
  };
  const data = {
    component: B,
    inputs: {
      title: 'this is a test title.',
      body: 'this is a test body.'
    }
  };
  const dataClone = {
    component: B,
    inputs: {
      title: 'this is a test title.',
      body: 'this is a test body.'
    }
  };

  it('isObject() should return true', function () {
    let undefined;

    expect(isObject(undefined)).toBeFalsy();
    expect(isObject("")).toBeFalsy();
    expect(isObject(blueprint)).toBeTruthy();
  });

  it('should merge two objects', function () {
    const result = {
      component: B,
      inputs: {
        title: 'this is a test title.',
        body: 'this is a test body.',
        labels: {
          button: "continue"
        }
      }
    };

    let merged = mergeDeep(blueprint, data);
    expect(merged).toEqual(result);
  });

  it('input parameter should be immutable', function () {
    expect(blueprint).toEqual(blueprintClone);
    expect(data).toEqual(dataClone);
  });
});