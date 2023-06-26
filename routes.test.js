import {jest} from '@jest/globals';
import asyncHandler from 'express-async-handler';
import config from 'config';
import * as commonAddOnUtils from './modules/utils/common_add_on_utils.js';
import generateNavigateBackResponse from './modules/common_add_on_handler.js';
import * as gmailAddOnHandler from './modules/gmail_add_on_handler.js';
import * as driveAddOnHandler from './modules/drive_add_on_handler.js';
import routes from './routes';

jest.mock('express-async-handler');
jest.mock('config');
jest.mock('./modules/utils/common_add_on_utils.js');
jest.mock('./modules/common_add_on_handler.js');
jest.mock('./modules/gmail_add_on_handler.js');
jest.mock('./modules/drive_add_on_handler.js');

describe('routes', () => {
  it('should expose a function', () => {
    expect(routes).toBeDefined();
  });

  it('routes should return expected output', () => {
    // const retValue = routes(app);
    // expect(false).toBeTruthy();
  });
});
