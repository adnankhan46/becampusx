export function parseMarkdownToHtml(text) {
    // Replace code blocks first
    text = text.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  
    // Replace inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  
    // Replace bold text
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
    // Replace italic text
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
    // Replace numbered lists
    text = text.replace(/^\d+\.\s(.*)/gm, '<li>$1</li>');
  
    // Replace unordered lists
    text = text.replace(/^\*\s(.*)/gm, '<li>$1</li>');
  
    // Wrap all list items in <ul> tags
    text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  
    // Replace line breaks with <br> tags
    text = text.replace(/\n/g, '<br>');
  
    return text;
  }