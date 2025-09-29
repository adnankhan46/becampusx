import { useEffect, useState } from 'react';
import useCompanyStore from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function DebugAuth() {
  const { company } = useCompanyStore();
  const [storageData, setStorageData] = useState<any>(null);

  useEffect(() => {
    // Get raw storage data
    const raw = localStorage.getItem('company-storage');
    if (raw) {
      try {
        setStorageData(JSON.parse(raw));
      } catch (e) {
        setStorageData({ error: 'Failed to parse' });
      }
    }
  }, []);

  const testAuthHeader = () => {
    const token = company?.token;
    console.log('=== AUTH DEBUG ===');
    console.log('Company from store:', company);
    console.log('Token:', token);
    console.log('Token exists:', !!token);
    console.log('Storage data:', storageData);
    console.log('=================');
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Authentication Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Company Store Data:</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(company, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold mb-2">LocalStorage Data:</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(storageData, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Token Status:</h3>
          <p className={company?.token ? 'text-green-600' : 'text-red-600'}>
            {company?.token ? '✓ Token exists' : '✗ No token found'}
          </p>
          {company?.token && (
            <p className="text-xs text-gray-600 mt-1 break-all">
              Token: {company.token.substring(0, 20)}...
            </p>
          )}
        </div>

        <Button onClick={testAuthHeader}>
          Test Auth in Console
        </Button>

        <div className="text-sm text-gray-600">
          <p className="font-semibold mb-1">Expected token path:</p>
          <p>localStorage → company-storage → state → company → token</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DebugAuth;