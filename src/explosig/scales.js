import { atom, selector } from 'recoil';

export function createAbstractScale(params) {
  const { id, name, domain, colorScaleKey } = params;
  return {
    id: atom({
      key: `scale.${id}.id`,
      default: id,
    }),
    name: atom({
      key: `scale.${id}.name`,
      default: name,
    }),
    colorScaleKey: atom({
      key: `scale.${id}.colorScaleKey`,
      default: colorScaleKey,
    }),
    domain: atom({
      key: `scale.${id}.domain`,
      default: domain,
    }),
    domainFiltered: atom({
      key: `scale.${id}.domainFiltered`,
      default: domain,
    }),
    highlight: atom({
        key: `scale.${id}.highlight`,
        default: null,
    }),
  };
}

export function createCategoricalScale(params) {
  const { id, name, domain, domainHuman, colorOverrides = {}, colorScaleKey } = params;
  const abstractScale = createAbstractScale(params);
  return {
    ...abstractScale,
    colorOverrides: atom({
      key: `scale.${id}.colorOverrides`,
      default: colorOverrides,
    }),
    domainHuman: atom({
      key: `scale.${id}.domainHuman`,
      default: domainHuman,
    }),
    domainSorted: atom({
        key: `scale.${id}.domainSorted`,
        default: domain,
    }),
  };
}

export function createContinuousScale(params) {
  const { id, name, domain, colorScaleKey } = params;
  const abstractScale = createAbstractScale(params);
  return {
    ...abstractScale,
  };
}


export function createDataset(params) {
    const { id, name, data } = params;
    return {
        id: atom({
            key: `data.${id}.id`,
            default: id,
        }),
        name: atom({
            key: `data.${id}.name`,
            default: name,
        }),
        data: atom({
            key: `data.${id}.data`,
            default: data,
        }),
    };
}