import {Role, Selector} from 'testcafe';


import studentAdmin from '../../auth/Roles';
import {base_url} from '../../config/constants';
import NewUserPage from '../../page_models/new-user-page';
import AccessUsersPage from '../../page_models/access-users-page';
import HamburgerMenuPage from "../../page_models/common/hamburgerMenuPage";
import NavBarPage from "../../page_models/common/navBarPage";
import SnackBarPage from "../../page_models/common/snackBarPage";

const log = require('npmlog');
const {getToken} = require('../../helpers/oauth-utils');
let newUserInvitePage = new NewUserPage();
let accessUsersPage = new AccessUsersPage();
const menu = new HamburgerMenuPage();
const navBar = new NavBarPage();
const snackBar = new SnackBarPage();


fixture`new-user-invite`
  .beforeEach(async t => {
    // log in as studentAdmin
    await t.useRole(studentAdmin);
    await t.maximizeWindow();
  }).afterEach(async t => {
  // logout
  await t.useRole(Role.anonymous());
});

test('test-school-user-activation-invite', async t => {

  await t.navigateTo(base_url);
  await menu.clickHamburgerMenu();
  await menu.clickAdministrationMenuOption();
  await menu.clickEDXAccessMenuLink();
  await t.wait(3000);
  await navBar.verifyNavTitleByText('User Management');
  await accessUsersPage.clickNewUserButton();
  await accessUsersPage.verifyUserByText('New User');

  await newUserInvitePage.setFirstName('TestUserFirstName');
  await newUserInvitePage.setLastName('TestUserLastName');
  await newUserInvitePage.setEmail('penemail@mailsac.com');
  await newUserInvitePage.selectRole('Secure Exchange');
  await newUserInvitePage.clickInviteBtn();

  await snackBar.verifySnackBarText('Success! The request is being processed.');

});
