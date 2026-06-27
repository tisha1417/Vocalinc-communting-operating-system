import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const FeedbackForm: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('feedback')
        .insert([
          {
            rating,
            comment: comment.trim() || null,
          }
        ]);

      if (submitError) {
        throw submitError;
      }

      setIsSubmitted(true);
      setRating(0);
      setComment('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      const errorMsg = err instanceof Error ? err.message : (err as any)?.message || 'Unknown error';
      setError(`Failed: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setRating(0);
    setComment('');
    setError('');
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center"
      >
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
        <p className="text-slate-400 mb-6">
          Your feedback has been submitted successfully. We appreciate your input!
        </p>
        <button
          onClick={resetForm}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Submit Another Feedback
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-xl p-8 border border-slate-700"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Share Your Feedback</h3>
          <p className="text-slate-400 text-sm">Help us improve VocaLinc</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div>
          <label className="block text-white font-medium mb-3">
            How would you rate your experience?
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-slate-500'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-3 text-slate-400">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div>
          <label htmlFor="comment" className="block text-white font-medium mb-3">
            Additional Comments (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows={4}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          <div className="text-right text-sm text-slate-400 mt-1">
            {comment.length}/500
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Feedback</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;