describe('kaggleIframe', () => {
    let originalOpen;
    let mockIframe;

    beforeEach(() => {
        originalOpen = window.open;
        window.open = jest.fn();
        mockIframe = document.createElement('iframe');
        mockIframe.setAttribute('src', 'https://example.com');
        document.body.appendChild(mockIframe);
    });

    afterEach(() => {
        window.open = originalOpen;
        if (document.body.contains(mockIframe)) {
            document.body.removeChild(mockIframe);
        }
    });

    it('should open iframe src in new window', () => {
        require('./index');
        expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
    });

    it('should handle case when iframe is not found', () => {
        if (document.body.contains(mockIframe)) {
            document.body.removeChild(mockIframe);
        }
        jest.clearAllMocks();
        require('./index');
        expect(window.open).toHaveBeenCalledWith(undefined, '_blank');
    });
}); 