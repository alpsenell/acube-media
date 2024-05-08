import { Input } from "@/components/ui/input.tsx"
import { useState, useEffect } from "react"
import GridPostList from "@/components/common/GridPostList.tsx"
import SearchResults from "@/components/common/SearchResults.tsx"
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queryAndMutations.ts"
import useDebounce from "@/hooks/debounce.ts"
import Spinner from "@/components/common/Spinner.tsx"
import { useInView } from "react-intersection-observer"

const Explore = () => {
  const { ref, inView } = useInView()
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()

  const [searchValue, setSearchValue] = useState('')
  const deboounced = useDebounce(searchValue, 300)
  const { data: searchedPosts, isFetching: isSearching } = useSearchPosts(deboounced)

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage()
    }
  }, [inView, searchValue])

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  const showSearchResults = searchValue !== ''
  const showPosts = !showSearchResults && posts.pages.every((item) => item.documents.length === 0)

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">
          Search Posts
        </h2>

        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            className="cursor-pointer"
            src="/assets/images/search.svg"
            alt="search posts"
            width={24}
            height={24}
          />

          <Input
            className="explore-search"
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={
              (event) => setSearchValue(event.target.value)
            }
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-6">
        <h3 className="body-bold md:h3-bold w-full">
          Popular Today
        </h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="text-sm md:text-md text-light-2">All</p>
          <img
            className="cursor-pointer"
            src="/assets/images/filter.svg"
            alt="filter"
            width={20}
            height={20}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {showSearchResults ? (
            <SearchResults
              isSearching={isSearching}
              searchedPosts={searchedPosts}
            />
          ) : showPosts ? (
            <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
          ) : posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item.documents}/>
          ))
        }
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-6">
          <Spinner/>
        </div>
        )
      }
    </div>
  )
}

export default Explore
