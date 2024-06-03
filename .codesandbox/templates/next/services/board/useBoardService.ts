import { useGetBoardsQuery } from "@/redux/services/board.api.slice";
import { useBoardInfoQuery } from "@/redux/services/board.api.slice";
import { handleSetBoard } from "@/redux/features/board.slice";
import { useDispatch } from "react-redux";

export default function useBoardService(roomId: string | undefined) {
  const { data: boardList } = useGetBoardsQuery(roomId || "");
  console.log("boardList", roomId, boardList);
  if (!boardList) return [];
  return boardList;
}

export function useBoardDetailService(boardId: string | undefined) {
  const dispatch = useDispatch();

  const { data: boardDetail } = useBoardInfoQuery(boardId || "");
  if (!boardDetail) return {};
  console.log("boardDetail", boardDetail);
  dispatch(handleSetBoard(boardDetail));
  return boardDetail;
}
