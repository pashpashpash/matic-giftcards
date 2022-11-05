// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./biconomy-metatx-standard/EIP712MetaTransaction.sol";

/**
 * eda11f84a344185cc51267181edbce7959fc569b
 * 53c4070247fae22847e99799ae19387ae3844240
 * a018b8910cef1e8ee3d83729819d8eb89c99b6ed
 *
 * <3
 */
contract RedeemableNative is EIP712MetaTransaction("RedeemableNative", "1") {
    /**
     * @dev Emitted when the native currency (e.g. ETH, MATIC) is deposited into slot `slotId`.
     */
    event Deposit(address indexed slotId, uint256 tokenAmount);

    /**
     * @dev Emitted when the native currency (e.g. ETH, MATIC) in `slotId` is taken out (redeemed) and transferred to `to`.
     */
    event Redeem(address indexed slotId, address to);

    struct TokenSlot {
        // True if this slot is either active or redeemed. This is used to ensure that slots are never reused.
        bool used;
        // True if active, false if inactive.
        bool active;
        uint256[] tokenAmount;
    }
    mapping(address => TokenSlot) internal _slots;

    /**
     * @dev Callable function to deposit the native currency (e.g. ETH, MATIC) into the Redeemable contract.
     */
    fallback() external payable {
        // Parse the redeemer key from the data
        require(
            msg.data.length == 32,
            "RedeemableNative: Token received data must be a 32-byte public key"
        );
        // Note: abi.decode can fail and revert without providing a reason.
        address redeemerKey = abi.decode(msg.data, (address));

        require(
            !isSlotUsed(redeemerKey),
            "RedeemableNative: A slot with that ID/redeemer key has already been used. Generate a new key to deposit this token."
        );

        uint256[] memory values = new uint256[](1);
        values[0] = msg.value;

        _slots[redeemerKey] = TokenSlot({
            used: true,
            active: true,
            tokenAmount: values
        });

        emit Deposit(redeemerKey, msg.value);
    }

    function isSlotActive(address slotId) public view returns (bool) {
        // tokenContract must be cleared/unset upon redemption.
        return _slots[slotId].active;
    }

    function slotData(address slotId) public view returns (TokenSlot memory) {
        return _slots[slotId];
    }

    function redeem(address slotId, address payable to) external {
        require(
            isSlotActive(slotId),
            "RedeemableNative: Requested slot is not active."
        );

        // Slot ID is the same as the redeemer key, and must equal the address that is calling redeem or signed the meta-transaction to redeem.
        require(
            msgSender() == slotId,
            "RedeemableNative: This caller is not authorized to redeem this slot."
        );

        // Make a copy of the slot data as we are about to overwrite it.
        TokenSlot memory slotCopy = _slots[slotId];

        // Empty the slot before calling the token contract. This protects from reentrant calls.
        // Leave a blank used record in place to prevent slot reuse.
        _slots[slotId] = TokenSlot({
            used: true,
            active: false,
            tokenAmount: new uint256[](0)
        });

        // transfer can fail and revert.
        (bool sent, ) = to.call{value: slotCopy.tokenAmount[0]}("");
        require(sent, "Failed to send Ether");

        emit Redeem(slotId, to);
    }

    function isSlotUsed(address slotId) private view returns (bool) {
        return _slots[slotId].used;
    }
}
