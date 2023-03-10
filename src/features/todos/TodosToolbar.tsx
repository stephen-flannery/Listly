type Props = {
    hasSelection?: boolean;
    handleDeleteClick: () => void;
    handleDoneClick: () => void;
    handleUndoneClick: () => void;
    selectedOnlyCompletedTodos: boolean;
};

export function TodosToolbar({
    hasSelection = false,
    handleDeleteClick,
    handleDoneClick,
    handleUndoneClick,
    selectedOnlyCompletedTodos,
}: Props) {
    return (
        <div className="p-4 h-[70px] flex items-center">
            <ul className="w-full flex justify-end gap-4">
                {hasSelection && (
                    <>
                        <li>
                            <button
                                type="button"
                                className="py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-red-100 hover:border-red-200 hover:text-red-700 focus:z-50 focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-400"
                                disabled={!hasSelection}
                                onClick={() => {
                                    if (selectedOnlyCompletedTodos) {
                                        handleUndoneClick();
                                    } else {
                                        handleDoneClick();
                                    }
                                }}
                            >
                                {selectedOnlyCompletedTodos
                                    ? 'Mark as not completed'
                                    : 'Mark as completed'}
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="py-2 px-4 text-sm font-medium text-gray-700 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-red-100 hover:border-red-200 hover:text-red-700 focus:z-50 focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-400"
                                disabled={!hasSelection}
                                onClick={handleDeleteClick}
                            >
                                Delete
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}
