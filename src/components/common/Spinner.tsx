const Spinner = () => {
  return (
    <div className="flex-center w-full">
      <img
        className="animate-spin"
        src="/assets/images/spinner.svg"
        alt="Loading..."
        width={24}
        height={24}
      />
    </div>
  )
}

export default Spinner
