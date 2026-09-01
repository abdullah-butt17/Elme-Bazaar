const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');

describe('ApiError', () => {
  it('sets statusCode, message, and errors', () => {
    const err = new ApiError(404, 'Not found', ['detail one']);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Not found');
    expect(err.errors).toEqual(['detail one']);
    expect(err.isOperational).toBe(true);
    expect(err).toBeInstanceOf(Error);
  });

  it('defaults errors to an empty array', () => {
    const err = new ApiError(500, 'Server error');
    expect(err.errors).toEqual([]);
  });
});

describe('asyncHandler', () => {
  it('calls the wrapped function with req, res, next', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    const wrapped = asyncHandler(handler);
    const req = {};
    const res = {};
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards a rejected promise to next()', async () => {
    const error = new Error('boom');
    const handler = jest.fn().mockRejectedValue(error);
    const wrapped = asyncHandler(handler);
    const next = jest.fn();

    await wrapped({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
