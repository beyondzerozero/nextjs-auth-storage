import PrivateStorageApp from "@/components/privateStorageApp";

export default function PrivateStorage() {
  return (
    <>
      <h1 className="mb-4 pt-28 text-4xl text-center">개인용 스토리지</h1>
      <div className="flex-1 w-full flex flex-col items-center">
        <PrivateStorageApp />
      </div>
    </>

  );
}