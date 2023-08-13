import { useState, useEffect } from "react";

const KEY = "5cbe8bdd";
// f84fc31d

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // callback function will only be called if it exists
      callback?.();
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {
            signal: controller.signal,
          });

          if (!res.ok) throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          setMovies(data.Search);
          // console.log(data);
          // console.log(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();

      // cleanup function to prevent useless fetches
      // abort current fetch request each time a new one comes in
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
