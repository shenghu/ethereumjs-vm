import BN = require('bn.js')
import { PrecompileInput, PrecompileResult, OOGResult } from './types'
const assert = require('assert')
const bn128 = require('rustbn.js')

export default function(opts: PrecompileInput): PrecompileResult {
  assert(opts.data)

  const inputData = opts.data
  const gasUsed = new BN(opts._common.param('gasPrices', 'ecMul'))

  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  let returnData = bn128.mul(inputData)
  // check ecmul success or failure by comparing the output length
  if (returnData.length !== 64) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    return: returnData,
    exception: 1,
  }
}
