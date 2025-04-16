
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MemoryCard from './MemoryCard';
import { shuffle } from '@/lib/utils';

interface MemoryGridProps {
  onMatch: () => void;
  onMove: () => void;
  onGameComplete: () => void;
}

const CARD_PAIRS = [
  { id: 1, emoji: "🌟", matched: false },
  { id: 2, emoji: "🎨", matched: false },
  { id: 3, emoji: "🌈", matched: false },
  { id: 4, emoji: "🎭", matched: false },
  { id: 5, emoji: "🎪", matched: false },
  { id: 6, emoji: "🎯", matched: false },
  { id: 7, emoji: "🎲", matched: false },
  { id: 8, emoji: "🎮", matched: false },
];

const MemoryGrid = ({ onMatch, onMove, onGameComplete }: MemoryGridProps) => {
  const [cards, setCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [disableFlip, setDisableFlip] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);
  
  useEffect(() => {
    // Check if all pairs are matched
    if (matchedPairs === CARD_PAIRS.length && matchedPairs > 0) {
      onGameComplete();
    }
  }, [matchedPairs, onGameComplete]);

  const initializeGame = () => {
    const duplicatedCards = [...CARD_PAIRS, ...CARD_PAIRS].map((card, index) => ({
      ...card,
      uniqueId: index,
      matched: false,
    }));
    setCards(shuffle(duplicatedCards));
    setFlippedCards([]);
    setMatchedPairs(0);
  };

  const handleCardClick = (index: number) => {
    if (disableFlip || flippedCards.includes(index) || cards[index].matched) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
    onMove();

    if (newFlippedCards.length === 2) {
      setDisableFlip(true);
      const [firstIndex, secondIndex] = newFlippedCards;

      if (cards[firstIndex].id === cards[secondIndex].id) {
        setCards(cards.map((card, idx) =>
          idx === firstIndex || idx === secondIndex
            ? { ...card, matched: true }
            : card
        ));
        onMatch();
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
        setDisableFlip(false);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setDisableFlip(false);
        }, 1000);
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-4 gap-4"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="show"
    >
      {cards.map((card, index) => (
        <MemoryCard
          key={card.uniqueId}
          card={card}
          isFlipped={flippedCards.includes(index) || card.matched}
          onClick={() => handleCardClick(index)}
        />
      ))}
    </motion.div>
  );
};

export default MemoryGrid;
