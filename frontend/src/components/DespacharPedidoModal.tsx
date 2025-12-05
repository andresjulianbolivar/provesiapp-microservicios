import React, { useState, useEffect } from 'react';

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

interface DespacharPedidoModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pedidoId: number;
  isSubmitting: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'verificar-productos',
    label: 'Verificar que todos los productos estén en el paquete',
    description: 'Revisar físicamente que cada producto del pedido esté incluido',
  },
  {
    id: 'verificar-calidad',
    label: 'Confirmar la calidad de los productos',
    description: 'Asegurar que no haya defectos o daños en los productos',
  },
  {
    id: 'embalaje-correcto',
    label: 'Embalaje adecuado y seguro',
    description: 'Verificar que el paquete esté bien protegido para el envío',
  },
  {
    id: 'etiqueta-direccion',
    label: 'Etiqueta con dirección de destino correcta',
    description: 'Confirmar que la etiqueta tenga la dirección correcta y sea legible',
  },
  {
    id: 'documentos-adjuntos',
    label: 'Documentos requeridos adjuntos (factura, guía)',
    description: 'Incluir todos los documentos necesarios para el despacho',
  },
];

const DespacharPedidoModal: React.FC<DespacharPedidoModalProps> = ({
  show,
  onClose,
  onConfirm,
  pedidoId,
  isSubmitting,
}) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showWarning, setShowWarning] = useState(false);

  // Reset state when modal closes or pedidoId changes
  useEffect(() => {
    if (!show) {
      setCheckedItems(new Set());
      setShowWarning(false);
    }
  }, [show]);

  const handleCheckboxChange = (itemId: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
    setShowWarning(false);
  };

  const allChecked = checkedItems.size === CHECKLIST_ITEMS.length;

  const handleConfirm = () => {
    if (!allChecked) {
      setShowWarning(true);
      return;
    }
    onConfirm();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ zIndex: 1050 }}
        aria-labelledby="despacharModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            {/* Header */}
            <div className="modal-header border-0" style={{ backgroundColor: '#0E2EB0' }}>
              <h5 className="modal-title text-white fw-bold" id="despacharModalLabel">
                <span className="me-2">📦</span>
                Despachar Pedido #{pedidoId}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleClose}
                disabled={isSubmitting}
                aria-label="Close"
              />
            </div>

            {/* Body */}
            <div className="modal-body p-4">
              {/* Info Alert */}
              <div className="alert alert-info border-0 mb-4" style={{ backgroundColor: '#e7f3ff' }}>
                <div className="d-flex align-items-start">
                  <span className="me-3 fs-4">ℹ️</span>
                  <div>
                    <strong className="d-block mb-1">Verificación obligatoria</strong>
                    <small className="text-muted">
                      Debes completar todos los ítems del checklist antes de marcar el pedido como despachado.
                      Esta verificación garantiza la calidad del servicio.
                    </small>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3" style={{ color: '#0E2EB0' }}>
                  Checklist de Despacho
                </h6>
                
                <div className="list-group">
                  {CHECKLIST_ITEMS.map((item, index) => (
                    <div
                      key={item.id}
                      className={`list-group-item border ${
                        checkedItems.has(item.id) ? 'border-success' : 'border-light'
                      } mb-2 rounded`}
                      style={{
                        backgroundColor: checkedItems.has(item.id) ? '#f0f9f4' : 'white',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div className="form-check d-flex align-items-start">
                        <input
                          type="checkbox"
                          className="form-check-input me-3 mt-1"
                          id={`check-${item.id}`}
                          checked={checkedItems.has(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                          disabled={isSubmitting}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          }}
                        />
                        <label
                          className="form-check-label w-100"
                          htmlFor={`check-${item.id}`}
                          style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                        >
                          <div className="d-flex align-items-center mb-1">
                            <span className="badge bg-secondary me-2">{index + 1}</span>
                            <strong className="text-dark">{item.label}</strong>
                          </div>
                          {item.description && (
                            <small className="text-muted d-block ms-4">
                              {item.description}
                            </small>
                          )}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Progreso del checklist</span>
                  <span className="fw-bold" style={{ color: allChecked ? '#198754' : '#0E2EB0' }}>
                    {checkedItems.size} / {CHECKLIST_ITEMS.length}
                  </span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${(checkedItems.size / CHECKLIST_ITEMS.length) * 100}%`,
                      backgroundColor: allChecked ? '#198754' : '#0E2EB0',
                      transition: 'width 0.3s ease',
                    }}
                    aria-valuenow={(checkedItems.size / CHECKLIST_ITEMS.length) * 100}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>

              {/* Warning Alert */}
              {showWarning && !allChecked && (
                <div className="alert alert-warning border-0 mb-0 animate__animated animate__shakeX">
                  <div className="d-flex align-items-center">
                    <span className="me-2 fs-5">⚠️</span>
                    <strong>Debes completar todos los ítems del checklist antes de continuar</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 bg-light">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <span className="me-2">✖️</span>
                Cancelar
              </button>
              <button
                type="button"
                className={`btn ${allChecked ? 'btn-success' : 'btn-secondary'}`}
                onClick={handleConfirm}
                disabled={isSubmitting || !allChecked}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Despachando...
                  </>
                ) : (
                  <>
                    <span className="me-2">✅</span>
                    {allChecked ? 'Confirmar Despacho' : 'Completa el Checklist'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DespacharPedidoModal;
