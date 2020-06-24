import { Injectable } from '@angular/core';
import { TextReplaceData } from 'src/app/interface/text-replace-data';
import { ReplaceStrings } from 'src/app/interface/replace-strings';

@Injectable({
  providedIn: 'root',
})
export class TextControlService {
  constructor() {}
  //Remove all the text given by the options
  removeAllOptions(originalString: string, options: TextReplaceData): string {
    const { removeFromTo, replaceText, removeAllTags } = options;
    if (removeFromTo) {
      originalString = this.removeReplaceStrings(originalString, removeFromTo);
    }
    if (replaceText) {
      for (let i = 0; i < replaceText.length; i++) {
        originalString = this.replaceText(
          originalString,
          replaceText[i].original,
          replaceText[i].replaceFor
        );
      }
    }
    if (removeAllTags) {
      for (let i = 0; i < removeAllTags.length; i++) {
        originalString = this.removeAllTags(originalString, removeAllTags[i]);
      }
    }
    return originalString;
  }
  removeReplaceStrings(
    originalString: string,
    replaceStrings: ReplaceStrings[]
  ): string {
    for (let i = 0; i < replaceStrings.length; i++) {
      originalString = this.removeTextFromTo(
        originalString,
        replaceStrings[i].replaceFor,
        replaceStrings[i].original,
        replaceStrings[i].originalEnd
      );
    }
    return originalString;
  }
  removedTotal = 0;
  //Remove all the given tag
  removeAllTags(originalString: string, tag: string): string {
    this.removedTotal = 0;
    while (originalString.indexOf(`<${tag}`) != -1) {
      originalString = this.removeTextFromTo(
        originalString,
        '',
        `<${tag}`,
        '>'
      );
      originalString = this.removeTextFromTo(
        originalString,
        '',
        `</${tag}`,
        '>'
      );
    }
    if (this.removedTotal == 0) {
      console.log("Didn't remove any " + tag + 'tag');
    }
    return originalString;
  }
  //Replace all the text from with in
  removeTextFromTo(
    originalString: string,
    replaceFor: string,
    start: string,
    end: string,
    startLookingAt?: number
  ): string {
    if (startLookingAt == null) {
      startLookingAt = 0;
    }
    let startIndex = originalString.indexOf(start, startLookingAt);
    if (startIndex == -1) {
      return originalString;
    }
    let endIndex = originalString.indexOf(end, startIndex);
    if (endIndex == -1) {
      return originalString;
    }

    let original = originalString.substring(startIndex, endIndex + end.length);
    originalString = this.replaceText(originalString, original, replaceFor);
    return originalString;
  }

  //Get the text between the given start and the end
  getTextBetween(
    originalString: string,
    beginString: string,
    endString: string
  ): string {
    var beginIndex = originalString.indexOf(beginString);
    if (beginIndex === -1) {
      return null;
    }
    var beginStringLength = beginString.length;
    var substringBeginIndex = beginIndex + beginStringLength;
    var substringEndIndex = originalString.indexOf(
      endString,
      substringBeginIndex
    );
    if (substringEndIndex === -1) {
      return null;
    }
    return originalString.substring(substringBeginIndex, substringEndIndex);
  }

  //Replace the text for a new one
  replaceText(
    originalString: string,
    textToRemove: string,
    newText: string
  ): string {
    // The general pattern is = text.split(search).join(replacement)
    return originalString.split(textToRemove).join(newText);
  }

  //Remove everything but the text between the given start and end text together with the start and end text
  keepAllTextInBetween(
    originalString: string,
    startText: string,
    endText: string
  ): string {
    let start = originalString.indexOf(startText);
    let end = originalString.indexOf(endText);

    if (start != -1 && end != -1) {
      return originalString.substring(start, end + endText.length);
    }
    return originalString;
  }

  //Insert text after finding the given text
  insertAfter(
    originalText: string,
    insertAfter: string,
    textToAdd: string
  ): string {
    let index = originalText.indexOf(insertAfter);
    let finalPart = originalText.substr(
      index + insertAfter.length,
      originalText.length
    );
    if (index >= 0) {
      originalText =
        originalText.substr(0, index + insertAfter.length) +
        textToAdd +
        finalPart;
    }
    return originalText;
  }
}
