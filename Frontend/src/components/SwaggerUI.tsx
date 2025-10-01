import React, { useState, useEffect } from 'react';
import { mockChatApi } from '../services/mockChatApi';

interface SwaggerUIProps {
  className?: string;
}

const SwaggerUI: React.FC<SwaggerUIProps> = ({ className = '' }) => {
  const [apiSpec, setApiSpec] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApiSpec = async () => {
      try {
        const spec = mockChatApi.getApiSpec();
        setApiSpec(spec);
      } catch (err) {
        setError('Failed to load API specification');
        console.error('Error loading API spec:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiSpec();
  }, []);

  const renderApiDocs = () => {
    if (!apiSpec) return null;

    const renderEndpoints = (paths: any) => {
      return Object.entries(paths).map(([path, pathItem]: [string, any]) => (
        <div key={path} className="mb-6 border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-semibold mb-3 text-blue-600">{path}</h3>

          {Object.entries(pathItem).map(([method, methodItem]: [string, any]) => (
            <div key={`${path}-${method}`} className="mb-4 ml-4 border-l-2 border-gray-200 pl-4">
              <div className="flex items-center mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${
                  method === 'get' ? 'bg-green-100 text-green-800' :
                  method === 'post' ? 'bg-blue-100 text-blue-800' :
                  method === 'put' ? 'bg-yellow-100 text-yellow-800' :
                  method === 'delete' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {method.toUpperCase()}
                </span>
                <span className="font-medium text-gray-800">{methodItem.summary}</span>
              </div>

              {methodItem.description && (
                <p className="text-sm text-gray-600 mb-2">{methodItem.description}</p>
              )}

              {methodItem.parameters && methodItem.parameters.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1">Parameters:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {methodItem.parameters.map((param: any, index: number) => (
                      <li key={index}>
                        <span className="font-mono">{param.name}</span>
                        <span className="text-gray-500">({param.in})</span> -
                        <span>{param.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {methodItem.requestBody && (
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1">Request Body:</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(methodItem.requestBody, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sm mb-1">Responses:</h4>
                {Object.entries(methodItem.responses).map(([statusCode, response]: [string, any]) => (
                  <div key={statusCode} className="mb-2">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                      {statusCode}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">{response.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ));
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold mb-4">{apiSpec.info.title}</h2>
          <p className="text-gray-600 mb-4">{apiSpec.info.description}</p>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Version: {apiSpec.info.version}</h3>
            <h3 className="font-semibold mb-2">Contact: {apiSpec.info.contact?.name}</h3>
          </div>
        </div>

        {apiSpec.servers && apiSpec.servers.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold mb-3">Servers:</h3>
            <ul className="space-y-2">
              {apiSpec.servers.map((server: any, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="font-mono bg-blue-100 px-2 py-1 rounded text-sm mr-2">
                    {server.url}
                  </span>
                  <span className="text-sm text-gray-600">{server.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold mb-4">API Endpoints:</h3>
          {renderEndpoints(apiSpec.paths)}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-red-600">
          <div className="text-2xl mb-2">❌</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
        <p className="text-gray-600">Interactive Swagger documentation for the WhatsApp Clone API</p>
      </div>
      {renderApiDocs()}
    </div>
  );
};

export default SwaggerUI;