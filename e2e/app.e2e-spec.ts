import { ElasticsearchQueryViewerPage } from './app.po';

describe('elasticsearch-query-viewer App', () => {
  let page: ElasticsearchQueryViewerPage;

  beforeEach(() => {
    page = new ElasticsearchQueryViewerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
