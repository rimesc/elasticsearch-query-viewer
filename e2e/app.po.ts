import { browser, by, element } from 'protractor';

export class ElasticsearchQueryViewerPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
