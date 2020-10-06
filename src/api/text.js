const KEEP_EMPTY_LINE = false;

module.exports = {

	justify(req, res) {
		let data = req.body;

		//* Split the content by paragraphs.
		//* Ignoring empty value
		let paragraphs = data.split('\r\n').filter( x => x );

		//* Justify each paragraph
		let justifiedParagraphsArray = [];
		for(let paragraph of paragraphs) {
      
			//* Splitting the paragraph content in an array or words.
			//* Ignoring empty value.
			let words = paragraph.split(' ').filter( x => x );

			if ( words.length === 0 ) {
				continue;
			}

			//* Create an array to store array of words.
			let lines = new Array(Math.ceil(paragraph.length / 80).length).fill([]);

			//* Iterate while there is still words.
			let idx = 0;
			while ( words.length ) {

				//* We get the current word
				let word = words.shift();

				//* We add it to the current line
				let newLine = [...lines[idx], word];

				//* We check if the line contains more than 80 characters
				if ( newLine.join(' ').length > 80 ) {

					//* If there is more than 80 characters,
					//* we move to the next line and add the word.
					idx += 1;
					lines[idx] = [word,];

				} else {

					//* Else we add the word to the current line.
					lines[idx] = newLine;

				}
			}

			//* Line can have less than 80 characters.
			//* So we fill them with spaces.
			for( let i = 0; i < lines.length; i++ ) {
				//* Get the array of words of the line
				let words = lines[i];
             
				if ( words.length > (KEEP_EMPTY_LINE ? 0 : 1) ) {

					//* We calculate the number of missing characters
					let diff = 80 - words.join(' ').length;
          
					if ( diff ) {
						//* When there is a diff,
						//* we iterate the line has 80 characters.
						//* We concat the first and second words with double space.
						while ( diff && words.length > 1 ) {
							let w1 = words.shift();
							let w2 = words[0] || '';

							words[0] = `${w1}  ${w2}`
							diff -= 1;
						}

						//* If there is still an diff, we the end of the string with space
						words[0] = words[0] + ' '.repeat(diff);
					}

					lines[i] = words.join(' ');
				}
			}

			justifiedParagraphsArray.push(lines.join('\r\n'))

		}
    
		return res.status(200).send(justifiedParagraphsArray.join('\r\n'));
	}

}