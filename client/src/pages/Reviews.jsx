import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { reviewAPI } from "../services/api.js";
import "./Reviews.css";

function Reviews() {
  const { id: watchId } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0); // New state for rating
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!watchId) return;
    try {
      setLoading(true);
      const data = await reviewAPI.getByWatch(watchId);
      setReviews(data || []);
    } catch (err) {
      setError("Failed to load reviews");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [watchId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleCreateReview = async () => {
    if (!newReview.trim()) return;
    if (rating < 1 || rating > 5) return setError("Please provide a rating between 1 and 5");
    if (!watchId) return setError("Watch ID missing");
    if (!user || !user.id) return setError("User not logged in");

    try {
      setLoading(true);
      const reviewData = {
        watch_id: watchId,
        content: newReview,
        user_id: user.id,
        rating // send rating to backend
      };
      const data = await reviewAPI.create(reviewData);
      console.log("Review created:", data);
      setNewReview("");
      setRating(0);
      await fetchReviews();
    } catch (err) {
      console.error("Failed to submit review", err);
      setError("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews-container">
      <h2>Reviews</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="reviews-list">
        {reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}
        {reviews.map((r) => (
          <div key={r.review_id} className="review-item">
            <strong>{r.user_name || "Anonymous"}</strong>
            <p>Rating: {r.rating || "N/A"} / 5</p>
            <p>{r.review_description || r.content}</p>
          </div>
        ))}
      </div>

      {user ? (
        <div className="review-form">
          <label>
            Rating: 
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={0}>Select rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </label>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            rows={4}
          />
          <button onClick={handleCreateReview} disabled={loading || !newReview.trim() || rating === 0}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      ) : (
        <p>Please log in to submit a review.</p>
      )}
    </div>
  );
}

export default Reviews;
