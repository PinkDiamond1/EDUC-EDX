/**
 * Tests to run against the school inbox page
 */
import {base_url, student_penList} from '../../config/constants';

import {Role} from 'testcafe';
import {getToken} from '../../helpers/oauth-utils';
import {createTestExchange} from '../../helpers/secure-exchange-utils';

import log from 'npmlog';
import Inbox from '../../page_models/inbox';

const studentAdmin = require('../../auth/Roles');
const testExchangeSubject = 'Created by test automation';
const inbox = new Inbox();
let token = '';
let testExchange = createTestExchange();

fixture `school-inbox`
  .before(async t => {
    getToken().then(async (data) => {
      token = data.access_token;
      // make sure there are no artifact messages from previous runs
      await inbox.deleteMessagesBySubject(testExchangeSubject);
    }).catch((error => {
      log.error("Failure during test setup: " + error);
    }));
  })
  .after(async ctx => {
    // find all test automation artifacts produced and remove them
    log.info("Performing tear-down operation");
    await inbox.deleteMessagesBySubject(testExchangeSubject);
  })
  .beforeEach(async t => {
    // log in as studentAdmin
    await t.useRole(studentAdmin);
    await t.maximizeWindow();
  }).afterEach(async t => {
  // logout
  await t.useRole(Role.anonymous());
});

test('test-send-new-message-with-students', async t => {
  // navigate to /inbox, expect title
  await t.navigateTo(base_url + '/inbox');
  await inbox.createANewMessage(testExchangeSubject);
  const penArr= student_penList.split(',');
  //test invalid pen number input
  await inbox.clickOnAddStudentButtonInNewMessage();
  await inbox.addStudentPenToSearchInNewMessage('123456789');
  await inbox.checkSearchPenButtonIsDisabled();
  await inbox.checkAddStudentButtonIsDisabled();

  //test valid pen number input
  await inbox.clearPenSearchText();
  await inbox.addStudentPenToSearchInNewMessage(penArr[0]);
  await inbox.checkSearchPenButtonIsEnabled();
  await inbox.checkAddStudentButtonIsDisabled();
  await inbox.clickPenSearchButton();
  await inbox.checkAddStudentButtonIsEnabled();
  await inbox.clickAddStudentButton();
  await inbox.studentAddedToNewMessageWithPen(penArr[0]);

  //test adding additional pen number which does not belong to the same mincode
  await inbox.clickOnAddStudentButtonInNewMessage();
  await inbox.assertAlertMessageAtAddStudent('Additional students should only be added if the details are relevant to this request. Requests for separate students should be sent in a new message.');
  await inbox.addStudentPenToSearchInNewMessage(penArr[1]);
  await inbox.checkSearchPenButtonIsEnabled();
  await inbox.clickPenSearchButton();
  await inbox.checkAddStudentButtonIsEnabled();
  await inbox.clickAddStudentButton();

  //test adding a student that doesn't exist
  await inbox.clickOnAddStudentButtonInNewMessage();
  await inbox.assertAlertMessageAtAddStudent('Additional students should only be added if the details are relevant to this request. Requests for separate students should be sent in a new message.');
  await inbox.addStudentPenToSearchInNewMessage(penArr[2]);
  await inbox.clickPenSearchButton();
  await inbox.assertAlertMessageAtAddStudent('PEN must be a valid PEN associated with a student at the Ministry of Education and Childcare');
  await inbox.checkAddStudentButtonIsDisabled();
  await inbox.clickCancelAddStudentButton();

  await inbox.clickNewMessagePostButton();
  let messageResponse = await inbox.findMessagesBySubject(testExchangeSubject);
  await t.expect(messageResponse.content.length).eql(3, 'Message created');
  log.info('Message created.');
});




