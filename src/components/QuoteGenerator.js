import React, { useState, useEffect } from 'react';
import './QuoteGenerator.css';

const QuoteGenerator = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.quotable.io/random?tags=motivation|success|inspiration');
      const data = await response.json();
      setQuote(data.content);
      setAuthor(data.author);
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Fallback quote if API fails
      setQuote('The only way to do great work is to love what you do.');
      setAuthor('Steve Jobs');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="quote-generator">
      <h3>Motivational Quote</h3>
      <div className="quote-container">
        {loading ? (
          <div className="loading">Loading quote...</div>
        ) : (
          <>
            <blockquote className="quote-text">
              "{quote}"
            </blockquote>
            <cite className="quote-author">— {author}</cite>
          </>
        )}
      </div>
      <button onClick={fetchQuote} className="btn btn-new-quote">
        New Quote
      </button>
    </div>
  );
};

export default QuoteGenerator; 