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
    domainSortedIndices: atom({
      key: `scale.${id}.domainSortedIndices`,
      default: null,
    }),
    domainFilteredIndices: atom({
      key: `scale.${id}.domainFilteredIndices`,
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
  };
}

export function createContinuousScale(params) {
  const { id, name, domain, colorScaleKey } = params;
  const abstractScale = createAbstractScale(params);
  return {
    ...abstractScale,
  };
}