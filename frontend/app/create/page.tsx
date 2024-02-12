const Create = () => {
  return (
    <div className="my-8 flex size-full flex-col items-center justify-center space-y-4 p-4">
      <input type="text" placeholder="Title" className="input input-bordered mb-4 w-full max-w-lg p-4 text-lg" />

      <select className="select select-bordered mb-4 w-full max-w-lg text-lg">
        <option disabled selected value="">
          資格種別を選択
        </option>
        <option>AWS</option>
        <option>Google Cloud</option>
        <option>Azure</option>
      </select>

      <select className="select select-bordered mb-4 w-full max-w-lg text-lg">
        <option disabled selected value="">
          資格名を選択
        </option>
        <option>Han Solo</option>
        <option>Greedo</option>
      </select>

      <textarea
        className="textarea textarea-bordered mb-4 size-full h-80 max-w-lg p-4 text-base"
        placeholder=""
      ></textarea>

      <button className="btn btn-primary w-full max-w-lg text-lg">送信</button>
    </div>
  );
};

export default Create;
