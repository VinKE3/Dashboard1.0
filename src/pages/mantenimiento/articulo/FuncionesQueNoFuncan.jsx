const [selectedLinea, setSelectedLinea] = useState(null);

useEffect(() => {
  if (lineas.length > 0 && !selectedLinea) {
    const primeraLinea = lineas;
    setSelectedLinea(primeraLinea);
    setData({ ...data, lineaId: primeraLinea.id });
    const subLineasFiltradas = subLineas.filter(
      (sublinea) => sublinea.lineaId === primeraLinea.id
    );
    setSubLineasFiltradas(subLineasFiltradas);
  }
}, [lineas, selectedLinea, subLineas, setData, data]);

useEffect(() => {
  if (data && data.lineaId) {
    const selected = lineas.find((linea) => linea.id === data.lineaId);
    setSelectedLinea(selected);
    const subLineasFiltradas = subLineas.filter(
      (sublinea) => sublinea.lineaId === data.lineaId
    );
    setSubLineasFiltradas(subLineasFiltradas);
  }
}, [data, lineas, subLineas]);

useEffect(() => {
  if (selectedLinea) {
    const subLineasFiltradas = subLineas.filter(
      (sublinea) => sublinea.lineaId === selectedLinea.id
    );
    setSubLineasFiltradas(subLineasFiltradas);
    setData({
      ...data,
      lineaId: selectedLinea.id,
      subLineaId: subLineasFiltradas[0]?.subLineaId,
    });
  }
}, [selectedLinea, subLineas]);
