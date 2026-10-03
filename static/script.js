function formatTextToHTML(text) {
    if (!text) return '';
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    html = html.replace(/```python\n([\s\S]*?)```/g, '<pre><code class="language-python">$1</code></pre>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><pre>/g, '<pre>');
    html = html.replace(/<\/pre><\/p>/g, '</pre>');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    return html;
}

function formatMarkdownHeadingsAndLists(text) {
    if (!text) return '';
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    html = html.replace(/```python\n([\s\S]*?)```/g, '<pre><code class="language-python">$1</code></pre>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
    html = html.replace(/^\s*[-*+]\s+(.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)(\n|$)/gms, function(match, p1) {
        return '<ul>' + p1.replace(/<\/li>\s*<li>/g, '</li><li>') + '</ul>';
    });
    html = html.replace(/(<\/ul>)\s*(<ul>)/g, '');
    html = html.replace(/^(<h[1-6]>.*<\/h[1-6]>)$/gm, '$1');
    html = html.replace(/\n\n+/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    html = html.replace(/(<\/h[1-6]>)<br>/g, '$1');
    html = html.replace(/(<\/ul>)<br>/g, '$1');
    html = html.replace(/(<pre>[\s\S]*?<\/pre>)<br>/g, '$1');
    html = html.replace(/(<p>)(\s*)(<\/p>)/g, '');
    if (!/^<p>|^<h[1-6]|^<ul>|^<pre>/.test(html.trim())) {
        html = '<p>' + html + '</p>';
    }
    return html;
}

function extractContent(responseContent) {
    if (typeof responseContent !== 'string') return responseContent;
    try {
        if (responseContent.trim().startsWith('{') || responseContent.trim().startsWith('[')) {
            const parsed = JSON.parse(responseContent);
            if (parsed && typeof parsed === 'object') {
                if (parsed.content) return parsed.content;
                if (parsed.text) return parsed.text;
                if (parsed.message) return parsed.message;
            }
        }
    } catch (e) {}
    return responseContent;
}

document.addEventListener('DOMContentLoaded', function() {
    const topicInput = document.getElementById('topic');
    const languageSelect = document.getElementById('language');
    const difficultySelect = document.getElementById('difficulty');
    const generateBtn = document.getElementById('generateBtn');
    const loadingSection = document.getElementById('loadingSection');
    const resultSection = document.getElementById('resultSection');
    const errorSection = document.getElementById('errorSection');
    const resultContent = document.getElementById('resultContent');
    const errorText = document.getElementById('errorText');
    const copyBtn = document.getElementById('copyBtn');
    const topicError = document.getElementById('topicError');
    
    let lastGeneratedContent = '';
    let isGenerating = false;
    
    function setLoading(loading) {
        isGenerating = loading;
        generateBtn.disabled = loading;
        if (loading) {
            generateBtn.textContent = 'Generating...';
            loadingSection.style.display = 'flex';
            resultSection.style.display = 'none';
            errorSection.style.display = 'none';
        } else {
            generateBtn.textContent = 'Generate Study Material';
            loadingSection.style.display = 'none';
        }
    }
    
    function showError(message) {
        errorText.textContent = message || 'An error occurred. Please try again.';
        errorSection.style.display = 'block';
        resultSection.style.display = 'none';
    }
    
    function showResult(content) {
        lastGeneratedContent = content;
        const formatted = formatMarkdownHeadingsAndLists(content);
        resultContent.innerHTML = formatted;
        resultSection.style.display = 'block';
        errorSection.style.display = 'none';
        resultContent.focus();
    }
    
    function clearError() {
        topicError.textContent = '';
        errorSection.style.display = 'none';
    }
    
    generateBtn.addEventListener('click', async function() {
        const topic = topicInput.value.trim();
        const language = languageSelect.value;
        const difficulty = difficultySelect.value;
        
        clearError();
        if (!topic) {
            topicError.textContent = 'Please enter a topic.';
            topicInput.focus();
            return;
        }
        
        if (isGenerating) return;
        
        setLoading(true);
        
        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: topic,
                    language: language,
                    difficulty: difficulty
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                const content = extractContent(data.content);
                showResult(content);
            } else {
                showError(data.error || 'The AI service is temporarily unavailable. Please try again.');
            }
        } catch (error) {
            showError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    });
    
    topicInput.addEventListener('input', function() {
        if (topicError.textContent) {
            topicError.textContent = '';
        }
    });
    
    copyBtn.addEventListener('click', async function() {
        if (!lastGeneratedContent) return;
        
        const originalText = copyBtn.textContent;
        try {
            await navigator.clipboard.writeText(lastGeneratedContent);
            copyBtn.textContent = 'Copied!';
            setTimeout(function() {
                copyBtn.textContent = originalText;
            }, 1500);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = lastGeneratedContent;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(function() {
                    copyBtn.textContent = originalText;
                }, 1500);
            } catch (fallbackErr) {
                copyBtn.textContent = 'Copy failed';
                setTimeout(function() {
                    copyBtn.textContent = originalText;
                }, 1500);
            }
            document.body.removeChild(textArea);
        }
    });
});