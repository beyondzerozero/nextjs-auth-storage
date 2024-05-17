"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function SharedStorageApp() {
  const [fileList, setFileList] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState("hidden");
  const supabase = createClientComponentClient();

  const listAllFile = async () => {
    setLoadingState("flex justify-center");
    const { data, error } = await supabase.storage
      .from("shared-bucket")
      .list("shared-folder", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });
    if (error) {
      console.log(error);
      return;
    }
    const tmpFileList = data;
    const result = [];
    for (let index = 0; index < tmpFileList.length; index++) {
      if (tmpFileList[index].name != ".emptyFolderPlaceholder") {
        result.push(tmpFileList[index].name);
      }
    }
    setFileList(result);

    setLoadingState("hidden");
  };

  useEffect(() => {
    (async () => {
      await listAllFile();
    })();
  }, []);

  const [file, setFile] = useState<File>();
  const handleChangeFile = (e: any) => {
    if (e.target.files.length !== 0) {
      setFile(e.target.files[0]);
    }
  };
  const onSubmit = async (event: any) => {
    event.preventDefault();

    const fileExtension = file!!.name.split(".").pop();
    const { error } = await supabase.storage
      .from("shared-bucket")
      .upload(`shared-folder/${uuidv4()}.${fileExtension}`, file!!);
    if (error) {
      alert("오류 발생：" + error.message);
      return;
    }
    setFile(undefined);

    await listAllFile();
  };

  const onDownload = async (e: any) => {
    const target = e.target as HTMLButtonElement;
    const item = target.previousSibling;
    const { data, error } = await supabase.storage
      .from("shared-bucket")
      .download(`shared-folder/${item?.textContent}`);
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item?.textContent}`;
      // 링크 클릭
      document.body.appendChild(a);
      a.click();

      // 후처리
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };
  return (
    <>
      <form className="mb-4 text-center" onSubmit={onSubmit}>
        <input
          className="relative mb-4 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
          type="file"
          id="formFile"
          onChange={(e) => {
            handleChangeFile(e);
          }}
        />
        <button
          type="submit"
          disabled={file == undefined}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-25"
        >
          업로드
        </button>
      </form>
      <div className="w-full max-w-3xl">
        <div className={loadingState} aria-label="로딩 중">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
        <ul className="w-full">
          {fileList.map((item, index) => (
            <li
              className="w-full h-auto p-1 border-b-2 flex justify-between"
              key={index}
            >
              <div>{item}</div>
              <button
                onClick={(e) => onDownload(e)}
                className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-1 text-center disabled:opacity-25"
              >
                다운로드
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
