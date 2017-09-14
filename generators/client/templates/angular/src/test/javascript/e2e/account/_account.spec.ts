<%#
 Copyright 2013-2017 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see http://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-%>
import { browser, element, by<%_ if (authenticationType === 'oauth2') { _%>, protractor<%_ } _%> } from 'protractor';
import { NavBarPage, SignInPage, PasswordPage, SettingsPage } from './../page-objects/jhi-page-objects';
<%_
let elementGetter = `getText()`;
if (enableTranslation) {
    elementGetter = `getAttribute('jhiTranslate')`;
} _%>

describe('account', () => {

    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let passwordPage: PasswordPage;
    let settingsPage: SettingsPage;
    <%_ if (authenticationType === 'oauth2') { _%>
    const ec = protractor.ExpectedConditions;
    <%_ } _%>

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage(true);
        browser.waitForAngular();
    });

    it('should fail to login with bad password', () => {
        <%_ if (enableTranslation) { _%>
        const expect1 = /home.title/;
        <%_ } else { _%>
        const expect1 = /Welcome, Java Hipster!/;
        <%_ } _%>
        element.all(by.css('h1')).first().<%- elementGetter %>.then((value) => {
            expect(value).toMatch(expect1);
        });
    <%_ if (authenticationType !== 'oauth2') { _%>
        signInPage = navBarPage.getSignInPage();
        signInPage.autoSignInUsing('admin', 'foo');

        <%_ if (enableTranslation) { _%>
        const expect2 = /login.messages.error.authentication/;
        <%_ } else { _%>
        const expect2 = /Failed to sign in!/;
        <%_ } _%>
        element.all(by.css('.alert-danger')).first().<%- elementGetter %>.then((value) => {
            expect(value).toMatch(expect2);
        });
    <%_ } else { _%>
        signInPage.loginWithOAuth('admin@jhipster.org', 'foo');

        // Keycloak
        const alert = element.all(by.css('.alert-error'));
        alert.isPresent().then((result) => {
            if (result) {
                expect(alert.first().getText()).toMatch("Invalid username or password.");
            } else {
                // Okta
                const error = element.all(by.css('.infobox-error')).first();
                browser.wait(ec.visibilityOf(error), 2000).then(() => {
                    expect(error.getText()).toMatch("Sign in failed!");
                });
            }
        });
    <%_ } _%>
    });

    it('should login successfully with admin account', () => {
        <%_ if (enableTranslation) { _%>
        const expect1 = /global.form.username/;
        <%_ } else { _%>
        const expect1 = /Login/;
        <%_ } _%>
        element.all(by.css('.modal-content label')).first().<%- elementGetter %>.then((value) => {
            expect(value).toMatch(expect1);
        });
        signInPage.clearUserName();
        signInPage.setUserName(<%_ if (authenticationType === 'oauth2') { _%>'admin@jhipster.org'<%_ } else { _%>'admin'<%_ } _%>);
        signInPage.clearPassword();
        signInPage.setPassword(<%_ if (authenticationType === 'oauth2') { _%>'Java is hip in 2017!'<%_ } else { _%>'admin'<%_ } _%>);
        signInPage.login();

        browser.waitForAngular();

        <%_ if (enableTranslation) { _%>
        const expect2 = /home.logged.message/;
        <%_ } else { _%>
        const expect2 = /You are logged in as user "admin"/;
        <%_ } _%>
        <%_ if (authenticationType !== 'oauth2') { _%>
        element.all(by.css('.alert-success span')).<%- elementGetter %>.then((value) => {
            expect(value).toMatch(expect2);
        });
        <%_ } else { _%>
        const success = element.all(by.css('.alert-success span')).first();
        browser.wait(ec.visibilityOf(success), 2000).then(() => {
            success.<%- elementGetter %>.then((value) => {
                expect(value).toMatch(expect2);
            });
        });

        navBarPage.autoSignOut();
        <%_ } _%>
    });
<%_ if (authenticationType !== 'oauth2') { _%>
    it('should be able to update settings', () => {
        settingsPage = navBarPage.getSettingsPage();

        <%_ if (enableTranslation) { _%>
        const expect1 = /settings.title/;
        <%_ } else { _%>
        const expect1 = /User settings for \[admin\]/;
        <%_ } _%>
        settingsPage.getTitle().then((value) => {
            expect(value).toMatch(expect1);
        });
        settingsPage.save();

        <%_ if (enableTranslation) { _%>
        const expect2 = /settings.messages.success/;
        <%_ } else { _%>
        const expect2 = /Settings saved!/;
        <%_ } _%>
        element.all(by.css('.alert-success')).first().<%- elementGetter %>.then((value) => {
            expect(value).toMatch(expect2);
        });
    });

    it('should be able to update password', () => {
        passwordPage = navBarPage.getPasswordPage();

        <%_ if (enableTranslation) { _%>
        expect(passwordPage.getTitle()).toMatch(/password.title/);
        <%_ } else { _%>
        expect(passwordPage.getTitle()).toMatch(/Password for \[admin\]/);
        <%_ } _%>

        passwordPage.setPassword('newpassword');
        passwordPage.setConfirmPassword('newpassword');
        passwordPage.save();

        <%_ if (enableTranslation) { _%>
        const expect2 = /password.messages.success/;
        <%_ } else { _%>
        const expect2 = /Password changed!/;
        <%_ } _%>
        element.all(by.css('.alert-success')).first().<%- elementGetter %>.then((value) => {
            expect(value).toMatch(expect2);
        });
        navBarPage.autoSignOut();
        navBarPage.goToSignInPage();
        signInPage.autoSignInUsing('admin', 'newpassword');

        // change back to default
        navBarPage.goToPasswordMenu()
        passwordPage.setPassword('admin');
        passwordPage.setConfirmPassword('admin');
        passwordPage.save();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
<%_ } _%>
});
