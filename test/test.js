var assert = require('assert');
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });

    it('should be able to get environment variables', function () {
        assert.equal(process.env.RAILS_ENV, 'development');
        assert.equal(process.env.WEBHOOK_SECRET, 'xiemngo');
      });
  });
});
