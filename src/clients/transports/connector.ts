import type { ErrorType } from '../../errors/utils.js'
import {
    type CreateTransportErrorType,
    type Transport,
    type TransportConfig,
    createTransport,
} from './createTransport.js'

type EthereumProvider = { request(...args: any): Promise<any> }

export type ConnectorTransportConfig = {
    /** The key of the transport. */
    key?: TransportConfig['key']
    /** The name of the transport. */
    name?: TransportConfig['name']
    /** The max number of times to retry. */
    retryCount?: TransportConfig['retryCount']
    /** The base delay (in ms) between retries. */
    retryDelay?: TransportConfig['retryDelay']
}

export type ConnectorTransport = Transport<
    'connector',
    {},
    EthereumProvider['request']
>

export type ConnectorTransportErrorType = CreateTransportErrorType | ErrorType

type Connector = {
    getProvider: () => Promise<EthereumProvider>
}

export function experimental_connector(connectors: Connector[], config: ConnectorTransportConfig = {}) {
    return (connector: Connector): ConnectorTransport | null => {
        if (connectors.includes(connector)) {
            const { key = 'connector', name = 'Connector Provider', retryDelay } = config
            return ({ retryCount: defaultRetryCount }) =>
                createTransport({
                    key,
                    name,
                    request: async ({ method, params }) => {
                        const provider = await connector.getProvider()
                        return provider.request({ method, params })
                    },
                    retryCount: config.retryCount ?? defaultRetryCount,
                    retryDelay,
                    type: 'connector',
                })
        }
        return null
    }
}
