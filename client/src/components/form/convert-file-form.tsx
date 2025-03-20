export function ConvertFileForm() {
  return (
    <>
      <form id="form" action="/" method="post" encType="multipart/form-data">
        <div className="fields">
          <fieldset className="field-format">
            <label htmlFor="select-formats">
              Please select an output format
            </label>
            <select id="select-formats" name="format"></select>
          </fieldset>

          <fieldset>
            <input type="file" name="file" />
          </fieldset>
        </div>

        <button type="submit">Convert your file</button>
      </form>

      <div className="error-container">
        <span id="error-message"></span>
      </div>
    </>
  );
}
