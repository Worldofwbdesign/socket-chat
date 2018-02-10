const { isRealString } = require('./validation')

describe('isRealString', () => {
  it('Should reject non-string values', () => {
    expect(isRealString(123)).toBe(false)
  })

  it('Should reject string with only spaces', () => {
    expect(isRealString('   ')).toBe(false)
  })

  it('Should Allow string with non-spaces characters', () => {
    expect(isRealString(' 123  ')).toBe(true)
  })
})