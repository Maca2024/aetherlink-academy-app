import {Data} from 'effect';

export class DeckNotFound extends Data.TaggedError('DeckNotFound')<{deckId:string}>{
 get message(){return 'Deck niet gevonden.';}
}
export class SlideNotFound extends Data.TaggedError('SlideNotFound')<{deckId:string;slideId:string}>{
 get message(){return `Slide ${this.slideId} niet gevonden.`;}
}
export class InvalidInput extends Data.TaggedError('InvalidInput')<{reason:string}>{
 get message(){return this.reason;}
}
export class EditFailed extends Data.TaggedError('EditFailed')<{reason:string;index:number}>{
 get message(){return `Bewerking ${this.index+1} mislukt: ${this.reason}`;}
}
export class StaleContent extends Data.TaggedError('StaleContent')<{deckId:string;slideId:string;currentHash:string}>{
 get message(){return `De slide is intussen gewijzigd (huidige contentHash ${this.currentHash}). Lees opnieuw met get_deck.`;}
}
export class RevisionConflict extends Data.TaggedError('RevisionConflict')<{deckId:string;expected:number;actual:number}>{
 get message(){return `Deck-revisie ${this.expected} is verouderd (actueel ${this.actual}).`;}
}
export class Forbidden extends Data.TaggedError('Forbidden')<{reason:string}>{
 get message(){return this.reason;}
}
export class StorageFailure extends Data.TaggedError('StorageFailure')<{cause:unknown}>{
 get message(){return 'Opslag van decks is tijdelijk niet beschikbaar.';}
}
export type SlidesError=DeckNotFound|SlideNotFound|InvalidInput|EditFailed|StaleContent|RevisionConflict|Forbidden|StorageFailure;

/** Map a tagged error onto the HTTP status the Express layer uses with `fail`. */
export const httpStatus=(error:SlidesError):number=>{
 switch(error._tag){
  case 'DeckNotFound':case 'SlideNotFound':return 404;
  case 'InvalidInput':return 400;
  case 'Forbidden':return 403;
  case 'StaleContent':case 'RevisionConflict':return 409;
  case 'EditFailed':return 422;
  case 'StorageFailure':return 503;
 }
};
