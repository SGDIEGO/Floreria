export default function BusquedaComponente() {
  return (
    <div>
      <form className="d-none d-md-flex input-group w-auto my-auto">
        <input
          autoComplete="off"
          type="search"
          value={busqueda}
          className="form-control rounded"
          placeholder='Search (ctrl + "/" to focus)'
          style={{ minWidth: "225px" }}
          onChange={(e) => actualizar_busqueda(e.target.value)}
        />
        <span className="input-group-text border-0">
          <button className="fas fa-search border border-0"></button>
        </span>
      </form>

      <select
        className="form-select"
        aria-label="Default select example"
        value={categoria}
        onChange={(e) => actualizar_categoria(e.target.value)}
      >
        <option selected>Open this select menu</option>
        <option value="id">Id</option>
        <option value="nombre">Nombre</option>
        <option value="descripcion">Descripcion</option>
      </select>
    </div>
  );
}
