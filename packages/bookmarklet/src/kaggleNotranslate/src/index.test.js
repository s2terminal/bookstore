describe('kaggleNotranslate', () => {
    let mockInput;
    let mockOutputWrapper;
    let mockBody;

    beforeEach(() => {
        mockInput = document.createElement('div');
        mockInput.className = 'input';
        document.body.appendChild(mockInput);

        mockOutputWrapper = document.createElement('div');
        mockOutputWrapper.className = 'output_wrapper';
        document.body.appendChild(mockOutputWrapper);

        mockBody = document.body;
    });

    afterEach(() => {
        if (document.body.contains(mockInput)) {
            document.body.removeChild(mockInput);
        }
        if (document.body.contains(mockOutputWrapper)) {
            document.body.removeChild(mockOutputWrapper);
        }
    });

    it('should add notranslate class to input elements', () => {
        require('./index');
        expect(mockInput.classList.contains('notranslate')).toBe(true);
    });

    it('should add notranslate class to output_wrapper elements', () => {
        require('./index');
        expect(mockOutputWrapper.classList.contains('notranslate')).toBe(true);
    });

    it('should set body overflow to visible', () => {
        require('./index');
        expect(mockBody.style.overflowY).toBe('visible');
    });
}); 