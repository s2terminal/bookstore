describe('selectionEdit', () => {
    let originalPrompt;
    let originalGetSelection;

    beforeEach(() => {
        originalPrompt = window.prompt;
        originalGetSelection = window.getSelection;
        window.prompt = jest.fn();
        window.getSelection = jest.fn().mockReturnValue({
            toString: () => 'selected text'
        });
    });

    afterEach(() => {
        window.prompt = originalPrompt;
        window.getSelection = originalGetSelection;
    });

    it('should call prompt with selected text', () => {
        require('./index');
        expect(window.prompt).toHaveBeenCalledWith('', 'selected text');
    });

    it('should handle case when no text is selected', () => {
        window.getSelection = jest.fn().mockReturnValue(null);
        jest.clearAllMocks();
        require('./index');
        expect(window.prompt).toHaveBeenCalledWith('', undefined);
    });
}); 