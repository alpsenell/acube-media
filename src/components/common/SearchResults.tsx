import { Models } from "appwrite"
import Spinner from "@/components/common/Spinner.tsx"
import GridPostList from "@/components/common/GridPostList.tsx"

type SearchResultsProps = {
  isSearching: boolean;
  searchedPosts: Models.Document[];
}

const SearchResults = ({ isSearching, searchedPosts }: SearchResultsProps) => {
  if (isSearching) {
    return <Spinner/>
  }

  if (searchedPosts && searchedPosts.documents.length) {
    return (
      <GridPostList posts={searchedPosts.documents} />
    )
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">
      No search results
    </p>
  )
}

export default SearchResults
