import { getMetadataKey, setMetadata } from './utils';
import { ParamType } from './typings';
import { RebirthHttpClient } from './client';

function paramBuilder(paramType: ParamType, optional = false) {
  return function (key?: string) {
    if (optional && !key) {
      throw new Error(`[NG-ZORRO]: ${paramType} key is required!`);
    }

    if (!key) {
      throw new Error(`[NG-ZORRO]: key is required!`);
    }

    return function (
      target: RebirthHttpClient,
      paramName: string | symbol,
      paramIndex: number
    ) {
      const metadataKey = getMetadataKey(paramName, paramType);
      const paramObj = {
        key,
        paramIndex,
      };

      setMetadata(target, metadataKey, paramObj);
    };
  };
}

export const Path = paramBuilder('Path');
export const Query = paramBuilder('Query', true);
export const Body = paramBuilder('Body')('Body');
export const Header = paramBuilder('Header');
