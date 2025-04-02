import { describe, it, expect, beforeEach } from 'vitest';
import { Clarinet } from './test-utils';

describe('manufacturer-verification contract', () => {
  let clarinet;
  
  beforeEach(() => {
    clarinet = new Clarinet();
  });
  
  it('allows contract owner to add a manufacturer', () => {
    const deployer = clarinet.accounts.get('deployer');
    const manufacturer = clarinet.accounts.get('wallet_1');
    
    const result = clarinet.callPublic(
        'manufacturer-verification',
        'add-manufacturer',
        [clarinet.types.principal(manufacturer.address)],
        deployer.address
    );
    
    expect(result.result).toEqual('(ok true)');
  });
  
  it('allows contract owner to remove a manufacturer', () => {
    const deployer = clarinet.accounts.get('deployer');
    const manufacturer = clarinet.accounts.get('wallet_1');
    
    // First add the manufacturer
    clarinet.callPublic(
        'manufacturer-verification',
        'add-manufacturer',
        [clarinet.types.principal(manufacturer.address)],
        deployer.address
    );
    
    // Then remove the manufacturer
    const result = clarinet.callPublic(
        'manufacturer-verification',
        'remove-manufacturer',
        [clarinet.types.principal(manufacturer.address)],
        deployer.address
    );
    
    expect(result.result).toEqual('(ok true)');
  });
  
  it('correctly checks if a manufacturer is verified', () => {
    const deployer = clarinet.accounts.get('deployer');
    const manufacturer = clarinet.accounts.get('wallet_1');
    const nonVerifiedManufacturer = clarinet.accounts.get('wallet_2');
    
    // Add the manufacturer
    clarinet.callPublic(
        'manufacturer-verification',
        'add-manufacturer',
        [clarinet.types.principal(manufacturer.address)],
        deployer.address
    );
    
    // Check verified manufacturer
    let result = clarinet.callReadOnly(
        'manufacturer-verification',
        'is-verified-manufacturer',
        [clarinet.types.principal(manufacturer.address)]
    );
    expect(result.result).toEqual('true');
    
    // Check non-verified manufacturer
    result = clarinet.callReadOnly(
        'manufacturer-verification',
        'is-verified-manufacturer',
        [clarinet.types.principal(nonVerifiedManufacturer.address)]
    );
    expect(result.result).toEqual('false');
  });
  
  it('prevents non-owners from adding manufacturers', () => {
    const nonOwner = clarinet.accounts.get('wallet_1');
    const manufacturer = clarinet.accounts.get('wallet_2');
    
    const result = clarinet.callPublic(
        'manufacturer-verification',
        'add-manufacturer',
        [clarinet.types.principal(manufacturer.address)],
        nonOwner.address
    );
    
    expect(result.result).toEqual('(err u100)'); // ERR-NOT-AUTHORIZED
  });
  
  it('allows contract owner to transfer ownership', () => {
    const deployer = clarinet.accounts.get('deployer');
    const newOwner = clarinet.accounts.get('wallet_1');
    
    const result = clarinet.callPublic(
        'manufacturer-verification',
        'transfer-ownership',
        [clarinet.types.principal(newOwner.address)],
        deployer.address
    );
    
    expect(result.result).toEqual('(ok true)');
  });
});
