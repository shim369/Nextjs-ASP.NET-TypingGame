using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace TypingGameAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private static readonly List<string> Words = new List<string>
        {
            "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew"
        };
        
        private static readonly Random Random = new Random();


        private static string LastWord = "";

        [HttpGet("getword")]
        public IActionResult GetWord()
        {
            string word;
            do
            {
                word = Words[Random.Next(Words.Count)];
            } while (word == LastWord);

            LastWord = word;
            return Ok(new { word = word });
        }

        [HttpPost("checkword")]
        public IActionResult CheckWord([FromBody] UserWordModel userWordModel)
        {
            if (userWordModel == null || string.IsNullOrEmpty(userWordModel.TypedWord))
            {
                return BadRequest(new { Message = "Invalid word." });
            }

            bool isCorrect = Words.Contains(userWordModel.TypedWord.ToLower());
            return Ok(new { isCorrect = isCorrect });
        }
    }

    public class UserWordModel
    {
        public string? TypedWord { get; set; }
    }
}
