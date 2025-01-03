import React from 'react';

import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = () => {

    return (
        <div className="loading">
            <ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="8" animationDuration="1s" />
            <a className="text-xl font-bold text-900">Carregando! Aguarde...</a>
        </div>
    )
}

export default Loading;