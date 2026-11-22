import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle } from 'lucide-react';

interface BankInfo {
  name: string;
  accountNumber: string;
  cci: string;
  color: string;
  hoverColor: string;
  logo: string;
  currency: 'PEN' | 'USD';
}

const banks: BankInfo[] = [
  {
    name: 'Scotiabank',
    accountNumber: '1740167315',
    cci: '00905920174016731579',
    color: '#EC111A',
    hoverColor: '#D10016',
    logo: 'https://images.unsplash.com/your-scotia-image',
    currency: 'PEN'
  },
  {
    name: 'Scotiabank',
    accountNumber: '8330604613',
    cci: '00972421833060461369',
    color: '#EC111A',
    hoverColor: '#D10016',
    logo: 'https://images.unsplash.com/your-scotia-image',
    currency: 'USD'
  },
  {
    name: 'Interbank',
    accountNumber: '8983281148771',
    cci: '00389801328114877140',
    color: '#00AA17',
    hoverColor: '#009314',
    logo: 'https://images.unsplash.com/your-interbank-image',
    currency: 'PEN'
  },
  {
    name: 'Interbank',
    accountNumber: '8983276416961',
    cci: '00389801327641696142',
    color: '#00AA17',
    hoverColor: '#009314',
    logo: 'https://images.unsplash.com/your-interbank-image',
    currency: 'USD'
  },
  {
    name: 'BCP',
    accountNumber: '19106563408004',
    cci: '00219110656340800450',
    color: '#002A8D',
    hoverColor: '#002178',
    logo: 'https://images.unsplash.com/your-bcp-image',
    currency: 'PEN'
  },
  {
    name: 'BCP',
    accountNumber: '19195244623188',
    cci: '00219119524462318859',
    color: '#002A8D',
    hoverColor: '#002178',
    logo: 'https://images.unsplash.com/your-bcp-image',
    currency: 'USD'
  },
  {
    name: 'BBVA',
    accountNumber: '0011-0814-0271451909',
    cci: '01181400027145190913',
    color: '#072146',
    hoverColor: '#061832',
    logo: 'https://images.unsplash.com/your-bbva-image',
    currency: 'PEN'
  }
];

const PaymentsPage = () => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'PEN' | 'USD'>('PEN');

  const copyToClipboard = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(accountNumber);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <section className="min-h-screen py-20 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8"
        >
          <h1 className="text-4xl font-bold mb-8">Payment Information</h1>
          <div className="mb-6 flex gap-4 items-center">
            <span className="font-mono">Select currency:</span>
            <button
              className={`px-4 py-2 border-2 border-black font-bold ${currency === 'PEN' ? 'bg-black text-white' : 'bg-white text-black'}`}
              onClick={() => setCurrency('PEN')}
            >Soles (PEN)</button>
            <button
              className={`px-4 py-2 border-2 border-black font-bold ${currency === 'USD' ? 'bg-black text-white' : 'bg-white text-black'}`}
              onClick={() => setCurrency('USD')}
            >Dólares (USD)</button>
          </div>
          <p className="text-lg font-mono mb-8">
            Select your preferred payment method.
          </p>

          {/* PayPal Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <a
              href="https://paypal.me/yuangtong"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-6 bg-[#0070BA] hover:bg-[#003087] text-white rounded-none border-4 border-black transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">PayPal</h3>
                  <p className="font-mono">Quick and secure payment</p>
                  <p className="font-mono text-yellow-200 font-bold">Only for payments in USD</p>
                </div>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.067 8.478c.492.315.844.825.983 1.39.185.63.159 1.351-.108 2.17-.474 1.397-1.829 2.402-3.36 2.402h-.368l-.006.102-.737 4.55-.006.066c-.071.413-.423.722-.844.722H12.15c-.421 0-.786-.31-.857-.722l-.737-4.718h-2.46c-.421 0-.787-.31-.857-.722L5.92 6.42l-.006-.066c-.071-.413.159-.826.58-.826h4.425c.421 0 .787.31.857.722l.737 4.718h2.46c2.618 0 4.494-1.825 4.997-4.2.185-.63.159-1.351-.108-2.17-.053-.198-.133-.38-.213-.545.475.315.844.825.983 1.39.185.63.159 1.351-.108 2.17-.474 1.397-1.829 2.402-3.36 2.402h-.368l-.006.102-.737 4.55-.006.066c-.071.413-.423.722-.844.722H12.15c-.421 0-.786-.31-.857-.722l-.737-4.718h-2.46c-.421 0-.787-.31-.857-.722L5.92 6.42l-.006-.066c-.071-.413.159-.826.58-.826h4.425c.421 0 .787.31.857.722l.737 4.718h2.46c2.618 0 4.494-1.825 4.997-4.2.185-.63.159-1.351-.108-2.17-.053-.198-.133-.38-.213-.545z"/>
                </svg>
              </div>
            </a>
          </motion.div>

          <h2 className="text-2xl font-bold mb-4">Bank Transfers</h2>
          <div className="grid gap-6">
            {banks.filter(bank => bank.currency === currency).map((bank) => (
              <motion.div
                key={bank.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div
                  style={{ 
                    backgroundColor: bank.color,
                    '--hover-color': bank.hoverColor
                  } as any}
                  className="w-full p-6 text-white rounded-none border-4 border-black transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">{bank.name}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-mono">Account: {bank.accountNumber}</p>
                      <button
                        onClick={() => copyToClipboard(bank.accountNumber)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        {copiedAccount === bank.accountNumber ? (
                          <CheckCircle size={24} />
                        ) : (
                          <Copy size={24} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-mono">CCI: {bank.cci}</p>
                      <button
                        onClick={() => copyToClipboard(bank.cci)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        {copiedAccount === bank.cci ? (
                          <CheckCircle size={24} />
                        ) : (
                          <Copy size={24} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-100 border-2 border-yellow-500">
            <p className="text-sm font-mono">
              Note: Please verify the account information before making any transfers.
              For security reasons, always double-check the account numbers.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PaymentsPage;