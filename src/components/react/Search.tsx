import Fuse from "fuse.js";
import { useEffect, useRef, useState, useMemo } from "react";
import Card from "@components/react/Card";
import type { CollectionEntry } from "astro:content";
import LogCard from "@components/react/LogCard";

export type SearchPostItem = {
  title: string;
  description: string;
  data: CollectionEntry<"blog">["data"];
  slug: CollectionEntry<"blog">["slug"];
};

export type SearchLogItem = {
  title: string;
  description: string;
  data: CollectionEntry<"log">["data"];
  slug: CollectionEntry<"log">["slug"];
};

interface Props {
  searchPostList: SearchPostItem[];
  searchLogList: SearchLogItem[];
}

interface SearchResult<T> {
  item: T;
  refIndex: number;
}

interface SearchResults {
  postResults: SearchResult<SearchPostItem>[] | null;
  logResults: SearchResult<SearchLogItem>[] | null;
}

export default function SearchBar({ searchPostList, searchLogList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    postResults: null,
    logResults: null,
  });

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuseForPost = useMemo(
    () =>
      new Fuse(searchPostList, {
        keys: ["title", "description"],
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.5,
      }),
    [searchPostList]
  );

  const fuseForLog = useMemo(
    () =>
      new Fuse(searchLogList, {
        keys: ["title", "description"],
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.5,
      }),
    [searchLogList]
  );

  useEffect(() => {
    // if URL has search query,
    // insert that search query in input field
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    // put focus cursor at the end of the string
    setTimeout(function () {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    // Add search result only if
    // input value is more than one character
    let inputResult =
      inputVal.length > 1
        ? {
            postResults: fuseForPost.search(inputVal),
            logResults: fuseForLog.search(inputVal),
          }
        : { postResults: [], logResults: [] };
    setSearchResults(inputResult);

    // Update search string in URL
    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.replaceState(history.state, "", newRelativePathQuery);
    } else {
      history.replaceState(history.state, "", window.location.pathname);
    }
  }, [inputVal]);

  return (
    <>
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
          </svg>
          <span className="sr-only">Search</span>
        </span>
        <input
          className="block w-full rounded border border-skin-fill 
        border-opacity-40 bg-skin-fill py-3 pl-10
        pr-3 placeholder:italic placeholder:text-opacity-75 
        focus:border-skin-accent focus:outline-none"
          placeholder="Search for anything..."
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          // autoFocus
          ref={inputRef}
        />
      </label>

      {inputVal.length > 1 && (
        <div className="mt-8">
          Found {searchResults.postResults?.length}
          {searchResults.postResults?.length &&
          searchResults.postResults.length === 1
            ? " result"
            : " results"}{" "}
          for '{inputVal}' in posts
        </div>
      )}

      <ul>
        {searchResults.postResults &&
          searchResults.postResults.map(({ item, refIndex }) => (
            <Card
              href={`/posts/${item.slug}/`}
              frontmatter={item.data}
              key={`${refIndex}-${item.slug}`}
            />
          ))}
      </ul>

      <br />

      {inputVal.length > 1 && (
        <div className="mt-8">
          Found {searchResults.logResults?.length}
          {searchResults.logResults?.length &&
          searchResults.logResults.length === 1
            ? " result"
            : " results"}{" "}
          for '{inputVal}' in logs
        </div>
      )}

      <ul>
        {searchResults.logResults &&
          searchResults.logResults.map(({ item, refIndex }) => (
            <LogCard
              href={`/logs/${item.slug}/`}
              frontmatter={item.data}
              key={`${refIndex}-${item.slug}`}
              slug={item.slug}
            />
          ))}
      </ul>
    </>
  );
}
