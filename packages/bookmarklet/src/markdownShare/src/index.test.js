describe('markdownShare', () => {
    let originalShare;
    let originalDocument;

    beforeEach(() => {
        originalShare = navigator.share;
        originalDocument = window.document;
        navigator.share = jest.fn();
        window.document = {
            title: 'Test Title',
            location: {
                href: 'https://example.com'
            }
        };
    });

    afterEach(() => {
        navigator.share = originalShare;
        window.document = originalDocument;
    });

    it('should call navigator.share with markdown formatted text', () => {
        jest.clearAllMocks();
        require('./index');
        expect(navigator.share).toHaveBeenCalledWith({
            text: '[Test Title](https://example.com)'
        });
    });
}); 